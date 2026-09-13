import json
import logging
from typing import Optional
from google import genai
from google.genai import types
from backend.app.config import settings
from backend.app.schemas.revision import RevisionPack

logger = logging.getLogger(__name__)

KURIO_SYSTEM_INSTRUCTION = """
You are KURIO's academic analysis and revision engine for university students.
Tagline: "Turn lectures into knowledge."
Your mission is to transform dense, raw lecture slides, handouts, or notes into a structured, high-retention Revision Pack.

CRITICAL PRODUCT RULES:
1. STRICT SOURCE GROUNDING:
   - Rely strictly and exclusively on the concepts, definitions, rules, and formulas presented in the provided lecture.
   - Do NOT invent outside topics or unstated facts.
2. NO EXAM PREDICTION CLAIMS:
   - Do NOT claim or imply that you can predict what will be on an exam.
   - Do NOT invent exam probabilities, percentages, or guesses.
   - Explain why topics are high priority using only their foundational weight in the lecture (e.g. "Central concept connected to multiple other topics in this lecture").
3. HIGH-PRIORITY REVISION TOPICS:
   - Extract the foundational concepts that form the core learning objectives of this lecture.
   - Priority levels:
     * "HIGH": Foundational pillars without which the rest of the lecture cannot be understood.
     * "MEDIUM": Core supporting mechanisms, procedures, or algorithms.
     * "LOW": Supplementary details, historical notes, or edge cases.
4. COMMON CONFUSION POINTS:
   - Identify specific pairs of concepts or terms in this lecture that students frequently confuse, conflate, or misunderstand (e.g., Paging vs. Segmentation, TLB Miss vs. Page Fault, Sigmoid vs. Softmax).
   - Clearly state the exact conceptual distinction and the common student misconception.
5. KEY CONCEPTS:
   - Extract 5-8 central terminology terms and crisp definitions that serve as conceptual building blocks.
6. PAGE / SLIDE MAPPING:
   - If slide or page markers (e.g. `--- [Slide / Page X] ---`) are present in the text, attribute `source_page: X`.
   - If page boundaries are absent or cannot be reliably determined, set `source_page: null` and provide a `source_section` title instead. NEVER guess or invent page numbers.
7. ACTIVE RECALL PRACTICE QUIZ:
   - Generate 5 to 8 conceptual and scenario-based multiple choice questions.
   - Each question must be derived directly from the lecture.
   - Each question must reference the corresponding `topic_id`.
   - Each question must have exactly 4 distinct options.
   - The `explanation` must explicitly explain why the correct option is right AND why each distractor is wrong.
8. RETURN FORMAT:
   - Output must strictly conform to the RevisionPack JSON schema.
"""

class GeminiService:
    def __init__(self):
        self._client: Optional[genai.Client] = None
        self._initialized_key: Optional[str] = None

    def get_client(self) -> Optional[genai.Client]:
        api_key = settings.get_api_key()
        if not api_key:
            return None

        # Re-initialize client if key has changed or not yet initialized
        if self._client is None or self._initialized_key != api_key:
            try:
                self._client = genai.Client(api_key=api_key)
                self._initialized_key = api_key
            except Exception as e:
                logger.error(f"Failed to initialize Gemini client: {e}")
                return None
        return self._client

    def is_configured(self) -> bool:
        return settings.is_gemini_configured

    async def generate_revision_pack(
        self, lecture_text: str, total_pages: int, has_reliable_pages: bool
    ) -> RevisionPack:
        client = self.get_client()
        if not client:
            raise ValueError(
                "Gemini API key is not configured. Set GEMINI_API_KEY in backend/.env to analyze custom PDFs."
            )

        # Truncation guardrail: if text is over 120,000 characters (~30,000 words),
        # keep first 60k and last 60k to avoid timeouts while preserving full lecture context.
        safe_text = lecture_text
        if len(safe_text) > 120000:
            logger.info("Lecture exceeds 120,000 chars, applying smart truncation guardrail.")
            safe_text = (
                safe_text[:60000]
                + "\n\n[... content truncated for optimal token processing ...]\n\n"
                + safe_text[-60000:]
            )

        prompt = f"""
Please analyze the following university lecture and synthesize a complete KURIO Revision Pack.

DOCUMENT METRICS:
- Detected Slides/Pages: {total_pages}
- Reliable Slide Markers Present: {has_reliable_pages}

LECTURE CONTENT:
{safe_text}
"""

        try:
            response = client.models.generate_content(
                model=settings.DEFAULT_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=KURIO_SYSTEM_INSTRUCTION,
                    response_mime_type="application/json",
                    response_schema=RevisionPack,
                    temperature=0.2,
                ),
            )

            raw_json = response.text
            parsed_data = json.loads(raw_json)

            # Enforce metadata ground truth from actual PDF parser
            if "metadata" in parsed_data:
                parsed_data["metadata"]["total_pages_detected"] = total_pages
                parsed_data["metadata"]["has_reliable_page_numbers"] = has_reliable_pages

            return RevisionPack.model_validate(parsed_data)

        except Exception as e:
            logger.error(f"Gemini generation error: {e}", exc_info=True)
            raise e

gemini_service = GeminiService()
