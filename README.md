# KURIO — Turn lectures into knowledge.
> **PromptWars 2026 @ VIT Bhopal | Problem Statement: AI-Powered Student Workspace**

KURIO eliminates university student busywork by turning dense lecture PDFs into an end-to-end cognitive revision pack in seconds:
**Upload Lecture PDF $\rightarrow$ Understand Lecture $\rightarrow$ Generate Revision Pack $\rightarrow$ Interactive Quiz $\rightarrow$ Knowledge Gap Diagnostics & Export.**

---

## ⚡ Product Flow & Key Highlights
- **Strict Grounding (No Exam Predictions)**: Grounded exclusively in the source material. Features **HIGH-PRIORITY REVISION TOPICS** (ranked by foundational centrality in the lecture) and **COMMON CONFUSION POINTS** (contrasting concepts and common student misconceptions).
- **Verified Page Mapping**: Displays slide/page references only when reliably extracted from the PDF structure; otherwise cleanly references the specific section without inventing page numbers.
- **Two One-Click Sample Lectures (100% Offline Reliable)**:
  1. *Operating Systems — Virtual Memory & Paging* (38 Slides • 5 Priority Topics • 5 Quiz Questions)
  2. *Machine Learning — Neural Networks, Backpropagation & Optimization* (44 Slides • 5 Priority Topics • 5 Quiz Questions)
- **Interactive Practice Quiz Arena**: One question at a time with 4 distinct options, active selection states, explicit check-answer validation, immediate feedback, and deep grounded explanations.
- **Revision Check & Knowledge Gap Diagnostics**: Evaluates performance from actual answers into **STRONG AREAS** and **NEEDS REVIEW**, directly answering *"What should I revise next?"*.
- **Download Revision Pack**: Direct `.md` file download, clipboard copy for Notion/Obsidian, and high-contrast print layout (`window.print()`).

---

## 🚀 Running Locally

### 1. Backend (FastAPI + Python 3.10+)
```powershell
# From workspace root
.\backend\.venv\Scripts\python.exe -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
```
- API Health Check: [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)
- Interactive API Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 2. Frontend (React 18 + Vite + Tailwind CSS)
```powershell
# From workspace root
cd frontend
$env:PATH = "C:\Program Files\nodejs;$env:PATH"
npm run dev -- --port 5173 --host 127.0.0.1
```
- Application UI: [http://127.0.0.1:5173/](http://127.0.0.1:5173/)

---

## 🔑 Environment Configuration
To process custom lecture PDFs with live Gemini intelligence:
1. Create or edit `backend/.env` (using `backend/.env.example` as reference):
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   ```
2. For judging demonstrations, the **Sample Mode** is completely self-contained and operates seamlessly with zero API dependencies.
