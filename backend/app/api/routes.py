import logging
from fastapi import APIRouter, File, HTTPException, UploadFile
from app.config import settings
from app.schemas.revision import (
    RevisionPack, QuizSubmission, QuizDiagnosticResult, TopicDiagnostic
)
from app.services.pdf_service import pdf_service
from app.services.gemini_service import gemini_service
from app.samples.sample_data import SAMPLE_LECTURES

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api")

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.VERSION,
        "gemini_configured": gemini_service.is_configured(),
        "model": settings.DEFAULT_MODEL
    }

@router.get("/samples")
async def get_sample_lectures():
    samples_list = []
    for key, pack in SAMPLE_LECTURES.items():
        samples_list.append({
            "id": key,
            "title": pack.metadata.title,
            "subject": pack.metadata.subject,
            "total_pages": pack.metadata.total_pages_detected,
            "estimated_study_time_mins": pack.metadata.estimated_study_time_mins,
            "total_topics": len(pack.high_priority_topics),
            "total_concepts": len(pack.key_concepts),
            "total_questions": len(pack.quiz)
        })
    return samples_list

@router.get("/samples/{sample_id}", response_model=RevisionPack)
async def get_sample_pack(sample_id: str):
    if sample_id not in SAMPLE_LECTURES:
        raise HTTPException(
            status_code=404,
            detail=f"Sample lecture '{sample_id}' not found. Available samples: {list(SAMPLE_LECTURES.keys())}"
        )
    return SAMPLE_LECTURES[sample_id]

@router.post("/analyze-lecture", response_model=RevisionPack)
async def analyze_lecture(file: UploadFile = File(...)):
    # Validate MIME/Extension
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Invalid file format. Please upload an academic lecture PDF."
        )

    try:
        file_bytes = await file.read()
        if len(file_bytes) == 0:
            raise HTTPException(status_code=400, detail="The uploaded PDF file is empty.")

        if len(file_bytes) > 50 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="The file exceeds the 50MB size limit.")

        # Extract text & track pages
        full_text, total_pages, pages_data, has_reliable_pages = pdf_service.extract_text_from_bytes(file_bytes)

        if len(full_text.strip()) < 80:
            raise HTTPException(
                status_code=400,
                detail="Unable to extract readable text from this PDF. It may be a scanned image-only PDF without OCR, or password-protected."
            )

        # Call Gemini for structured cognition
        revision_pack = await gemini_service.generate_revision_pack(
            lecture_text=full_text,
            total_pages=total_pages,
            has_reliable_pages=has_reliable_pages
        )

        return revision_pack

    except HTTPException:
        raise
    except ValueError as ve:
        logger.warning(f"Configuration or validation warning: {ve}")
        raise HTTPException(status_code=503, detail=str(ve))
    except Exception as e:
        logger.error(f"Error analyzing lecture PDF: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process lecture: {str(e)}"
        )

@router.post("/quiz-diagnostic/{sample_or_pack_id}", response_model=QuizDiagnosticResult)
async def calculate_quiz_diagnostic(sample_or_pack_id: str, submission: QuizSubmission):
    """
    Evaluates student quiz answers and diagnoses conceptual knowledge gaps.
    """
    if sample_or_pack_id in SAMPLE_LECTURES:
        quiz = SAMPLE_LECTURES[sample_or_pack_id].quiz
    else:
        raise HTTPException(status_code=404, detail="Lecture reference not found for diagnostic.")

    quiz_map = {q.id: q for q in quiz}
    topics_stats = {}

    score = 0
    total = len(quiz)

    for answer in submission.answers:
        q = quiz_map.get(answer.question_id)
        if not q:
            continue

        if q.topic_id not in topics_stats:
            topics_stats[q.topic_id] = {
                "title": q.topic_title,
                "total": 0,
                "correct": 0
            }

        topics_stats[q.topic_id]["total"] += 1
        if answer.selected_option_index == q.correct_answer_index:
            score += 1
            topics_stats[q.topic_id]["correct"] += 1

    percentage = round((score / total * 100), 1) if total > 0 else 0.0

    topics_breakdown = []
    strong_areas = []
    needs_review = []
    what_to_revise_next = []

    for t_id, data in topics_stats.items():
        mastery = round((data["correct"] / data["total"] * 100), 1) if data["total"] > 0 else 0.0
        
        if mastery >= 80:
            status = "MASTERED"
            recommendation = "Solid conceptual mastery. You can confidently apply this core principle."
            strong_areas.append(data["title"])
        elif mastery >= 50:
            status = "NEEDS_REVIEW"
            recommendation = "Review core definitions and key formulas to eliminate confusion on edge cases."
            needs_review.append(data["title"])
            what_to_revise_next.append(f"Revisit '{data['title']}' to clarify edge case distinctions.")
        else:
            status = "CRITICAL_GAP"
            recommendation = "High priority: Revisit the source lecture concepts and review Common Confusion Points."
            needs_review.append(data["title"])
            what_to_revise_next.append(f"Foundational Gap: Prioritize re-reading '{data['title']}'.")

        topics_breakdown.append(TopicDiagnostic(
            topic_id=t_id,
            topic_title=data["title"],
            total_questions=data["total"],
            correct_questions=data["correct"],
            mastery_percentage=mastery,
            status=status,
            recommendation=recommendation
        ))

    if not what_to_revise_next:
        what_to_revise_next.append("All evaluated topics mastered! Ready for advanced applications.")

    return QuizDiagnosticResult(
        total_questions=total,
        score=score,
        percentage=percentage,
        strong_areas=strong_areas,
        needs_review=needs_review,
        topics_breakdown=topics_breakdown,
        what_to_revise_next=what_to_revise_next
    )
