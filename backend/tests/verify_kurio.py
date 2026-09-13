import urllib.request
import json
import os
import sys

sys.path.insert(0, os.path.abspath("."))

BASE_URL = 'http://127.0.0.1:8000'

def test_api():
    print('=== 1. Health Check ===')
    with urllib.request.urlopen(f'{BASE_URL}/api/health') as r:
        health = json.loads(r.read())
        print('Health status:', health)
        assert health['status'] == 'healthy'
        assert health['app'] == 'KURIO API'

    print('\n=== 2. Sample Lectures Listing ===')
    with urllib.request.urlopen(f'{BASE_URL}/api/samples') as r:
        samples = json.loads(r.read())
        print(f'Samples available: {len(samples)}')
        for s in samples:
            print(f"  * {s['id']}: {s['title']} ({s['total_topics']} topics, {s['total_concepts']} concepts, {s['total_questions']} Qs)")
        assert len(samples) == 2

    print('\n=== 3. Testing Sample 1: OS Virtual Memory ===')
    with urllib.request.urlopen(f'{BASE_URL}/api/samples/os_paging') as r:
        pack_os = json.loads(r.read())
        print(f"Title: {pack_os['metadata']['title']}")
        print(f"Key concepts: {len(pack_os['key_concepts'])}")
        print(f"High-priority topics: {len(pack_os['high_priority_topics'])}")
        print(f"Common confusion points: {len(pack_os['common_confusion_points'])}")
        print(f"Quiz questions: {len(pack_os['quiz'])}")
        assert len(pack_os['quiz']) == 5
        assert len(pack_os['key_concepts']) == 5

    print('\n=== 4. Testing Sample 2: ML Neural Networks ===')
    with urllib.request.urlopen(f'{BASE_URL}/api/samples/neural_networks') as r:
        pack_ml = json.loads(r.read())
        print(f"Title: {pack_ml['metadata']['title']}")
        print(f"Key concepts: {len(pack_ml['key_concepts'])}")
        print(f"High-priority topics: {len(pack_ml['high_priority_topics'])}")
        print(f"Common confusion points: {len(pack_ml['common_confusion_points'])}")
        print(f"Quiz questions: {len(pack_ml['quiz'])}")
        assert len(pack_ml['quiz']) == 5
        assert len(pack_ml['key_concepts']) == 5

    print('\n=== 5. Testing Quiz Diagnostic Calculation ===')
    submission = {
        'answers': [
            {'question_id': 'q_1', 'selected_option_index': 0}, # correct
            {'question_id': 'q_2', 'selected_option_index': 1}, # correct
            {'question_id': 'q_3', 'selected_option_index': 1}, # correct
            {'question_id': 'q_4', 'selected_option_index': 0}, # incorrect
            {'question_id': 'q_5', 'selected_option_index': 1}  # correct
        ]
    }
    req = urllib.request.Request(
        f'{BASE_URL}/api/quiz-diagnostic/os_paging',
        data=json.dumps(submission).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req) as r:
        diag = json.loads(r.read())
        print(f"Score: {diag['score']} / {diag['total_questions']} ({diag['percentage']}%)")
        print(f"STRONG AREAS: {diag['strong_areas']}")
        print(f"NEEDS REVIEW: {diag['needs_review']}")
        print(f"What should I revise next: {diag['what_to_revise_next']}")
        assert diag['score'] == 4
        assert 'Virtual Address Translation & Paging Mechanics' in diag['strong_areas']
        assert 'Page Replacement Algorithms' in diag['needs_review']

    print('\n=== 6. Testing PDF Text Extraction on Real File ===')
    from backend.app.services.pdf_service import pdf_service
    pdf_path = 'backend/sample_files/Operating_Systems_Virtual_Memory.pdf'
    with open(pdf_path, 'rb') as f:
        pdf_bytes = f.read()
    text, pages, pdata, has_rel = pdf_service.extract_text_from_bytes(pdf_bytes)
    print(f"Extracted {len(text)} chars across {pages} slides. Page numbers reliable: {has_rel}")
    assert pages == 7
    assert has_rel == True

    print('\n=== 7. Testing Invalid File & Empty Document Handling ===')
    try:
        from fastapi.testclient import TestClient
        from backend.app.main import app
        client = TestClient(app)
        
        # Non-PDF
        r_txt = client.post("/api/analyze-lecture", files={"file": ("test.txt", b"hello world", "text/plain")})
        print(f"Non-PDF rejection: status {r_txt.status_code} ({r_txt.json()['detail']})")
        assert r_txt.status_code == 400

        # Empty PDF
        r_empty = client.post("/api/analyze-lecture", files={"file": ("empty.pdf", b"", "application/pdf")})
        print(f"Empty PDF rejection: status {r_empty.status_code} ({r_empty.json()['detail']})")
        assert r_empty.status_code == 400

        from backend.app.services.gemini_service import gemini_service
        # Valid PDF Analysis handling
        r_valid_pdf = client.post(
            "/api/analyze-lecture", 
            files={"file": ("lecture.pdf", pdf_bytes, "application/pdf")}
        )
        if gemini_service.is_configured():
            print(f"Upload with active API key: status {r_valid_pdf.status_code}")
            assert r_valid_pdf.status_code == 200, f"Expected 200, got {r_valid_pdf.status_code}: {r_valid_pdf.text}"
            pack_data = r_valid_pdf.json()
            print(f"  * Generated Title: {pack_data['metadata']['title']}")
            print(f"  * High-priority topics: {len(pack_data['high_priority_topics'])}")
            print(f"  * Confusion points: {len(pack_data['common_confusion_points'])}")
            print(f"  * Quiz questions: {len(pack_data['quiz'])}")
            assert len(pack_data['quiz']) >= 5
        else:
            print(f"Upload without API key handling: status {r_valid_pdf.status_code} ({r_valid_pdf.json()['detail'][:60]}...)")
            assert r_valid_pdf.status_code == 503

        print("Error states correctly handled and validated!")
    except ImportError:
        print("TestClient optional; basic tests passed.")

    print('\n========================================')
    print('[SUCCESS] ALL KURIO BACKEND TESTS PASSED!')
    print('========================================')

if __name__ == '__main__':
    test_api()
