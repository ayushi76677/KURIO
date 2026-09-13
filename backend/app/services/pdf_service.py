import io
import re
from typing import Dict, List, Tuple
from pypdf import PdfReader

class PDFService:
    @staticmethod
    def extract_text_from_bytes(file_bytes: bytes) -> Tuple[str, int, List[Dict[str, any]], bool]:
        """
        Extracts text from PDF bytes page by page.
        Returns:
            (full_formatted_text, total_pages, list_of_pages, has_reliable_pages)
        """
        reader = PdfReader(io.BytesIO(file_bytes))
        total_pages = len(reader.pages)
        pages_data = []
        combined_text_parts = []
        non_empty_pages_count = 0

        for idx, page in enumerate(reader.pages):
            page_num = idx + 1
            raw_text = page.extract_text() or ""
            # Clean up excessive blank lines and whitespace
            cleaned_text = re.sub(r'\r\n|\r', '\n', raw_text)
            cleaned_text = re.sub(r'[ \t]+', ' ', cleaned_text)
            cleaned_text = re.sub(r'\n{3,}', '\n\n', cleaned_text).strip()

            if len(cleaned_text) > 30:
                non_empty_pages_count += 1

            pages_data.append({
                "page_num": page_num,
                "text": cleaned_text,
                "char_count": len(cleaned_text)
            })

            combined_text_parts.append(f"--- [Slide / Page {page_num}] ---\n{cleaned_text}")

        # Page numbering is reliable if at least 60% of pages contain extractable text
        has_reliable_pages = (total_pages > 0) and ((non_empty_pages_count / total_pages) >= 0.5)
        full_text = "\n\n".join(combined_text_parts)

        return full_text, total_pages, pages_data, has_reliable_pages

pdf_service = PDFService()
