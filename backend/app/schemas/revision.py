from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field

class TopicPriority(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"

class KeyConcept(BaseModel):
    id: str = Field(description="Unique concept identifier e.g. concept_1")
    name: str = Field(description="Name or title of the key concept")
    definition: str = Field(description="Crisp 1-2 sentence core definition directly grounded in lecture")
    importance_summary: str = Field(description="Why this concept is central to understanding the lecture")
    source_page: Optional[int] = Field(None, description="Slide or page number if reliably identified, otherwise null")

class RevisionTopic(BaseModel):
    id: str = Field(description="Unique identifier e.g. topic_1, topic_2")
    title: str = Field(description="Concept or topic title directly from lecture")
    priority: TopicPriority = Field(description="Revision priority based strictly on foundational weight in this lecture")
    why_important: str = Field(description="Reason explaining why this concept is central or foundational, grounded only in lecture text")
    core_summary: str = Field(description="Crisp 2-3 sentence explanation of the core concept")
    key_formulas_or_rules: Optional[List[str]] = Field(default_factory=list, description="Explicit rules, formulas, algorithms, or definitions stated in the lecture")
    source_page: Optional[int] = Field(None, description="Actual slide or page number if reliably identified, otherwise null")
    source_section: Optional[str] = Field(None, description="Section or slide heading from the lecture text")

class ConfusionPoint(BaseModel):
    id: str = Field(description="Unique identifier e.g. conf_1")
    topic_ref: str = Field(description="Topic title or concept name referenced")
    concept_a: str = Field(description="First concept often confused")
    concept_b: str = Field(description="Second concept or contrasting idea")
    key_distinction: str = Field(description="Clear breakdown explaining the exact conceptual difference")
    common_misconception: str = Field(description="What students often incorrectly assume or conflate")
    source_page: Optional[int] = Field(None, description="Actual slide or page number if reliably identified, otherwise null")

class Flashcard(BaseModel):
    id: str = Field(description="Unique identifier e.g. card_1")
    topic_id: str = Field(description="ID of the associated revision topic")
    front: str = Field(description="Active-recall prompt or key question")
    back: str = Field(description="Direct, accurate answer synthesized from the lecture")
    hint: Optional[str] = Field(None, description="Optional hint for active recall")

class QuizQuestion(BaseModel):
    id: str = Field(description="Unique identifier e.g. q_1")
    topic_id: str = Field(description="ID of the revision topic tested by this question")
    topic_title: str = Field(description="Name of the topic tested")
    question: str = Field(description="Conceptual or scenario-based multiple choice question derived strictly from lecture content")
    options: List[str] = Field(description="List of exactly 4 distinct options")
    correct_answer_index: int = Field(description="Index of correct answer (0, 1, 2, or 3)")
    explanation: str = Field(description="Detailed explanation explaining why the correct answer is right and why each distractor is wrong")
    difficulty: str = Field(default="MEDIUM", description="EASY, MEDIUM, or HARD")

class ExecutiveSummary(BaseModel):
    overview: str = Field(description="Comprehensive synthesis of the lecture's core themes")
    key_takeaways: List[str] = Field(description="4-6 vital points from the lecture")
    foundational_prerequisites: List[str] = Field(description="Prerequisite topics assumed by this lecture")

class LectureMetadata(BaseModel):
    title: str = Field(description="Synthesized or extracted title of the lecture")
    subject: str = Field(description="Subject or course domain (e.g., Computer Science, Machine Learning)")
    total_pages_detected: int = Field(description="Total pages detected in the PDF")
    estimated_study_time_mins: int = Field(description="Estimated realistic active study time in minutes")
    has_reliable_page_numbers: bool = Field(default=False, description="True if slide/page boundaries were clearly identified")

class RevisionPack(BaseModel):
    metadata: LectureMetadata
    executive_summary: ExecutiveSummary
    key_concepts: List[KeyConcept] = Field(default_factory=list, description="Core vocabulary and conceptual building blocks")
    high_priority_topics: List[RevisionTopic]
    common_confusion_points: List[ConfusionPoint]
    flashcards: List[Flashcard]
    quiz: List[QuizQuestion]

class QuizSubmissionAnswer(BaseModel):
    question_id: str
    selected_option_index: int

class QuizSubmission(BaseModel):
    answers: List[QuizSubmissionAnswer]

class TopicDiagnostic(BaseModel):
    topic_id: str
    topic_title: str
    total_questions: int
    correct_questions: int
    mastery_percentage: float
    status: str  # "MASTERED", "NEEDS_REVIEW", "CRITICAL_GAP"
    recommendation: str
    source_page: Optional[int] = None

class QuizDiagnosticResult(BaseModel):
    total_questions: int
    score: int
    percentage: float
    strong_areas: List[str]
    needs_review: List[str]
    topics_breakdown: List[TopicDiagnostic]
    what_to_revise_next: List[str]
