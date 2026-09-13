import type {
  RevisionPack,
  SampleLectureSummary,
  QuizDiagnosticResult,
  TopicDiagnostic,
  QuizQuestion
} from '../types/revision';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export async function checkBackendHealth(): Promise<{ status: string; gemini_configured: boolean }> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch {
    return { status: 'offline', gemini_configured: false };
  }
}

export async function getSampleLectures(): Promise<SampleLectureSummary[]> {
  const res = await fetch(`${API_BASE_URL}/api/samples`);
  if (!res.ok) {
    throw new Error('Failed to load sample lectures');
  }
  return await res.json();
}

export async function getSamplePack(sampleId: string): Promise<RevisionPack> {
  const res = await fetch(`${API_BASE_URL}/api/samples/${sampleId}`);
  if (!res.ok) {
    throw new Error(`Failed to load sample pack: ${sampleId}`);
  }
  return await res.json();
}

export async function analyzeLecturePdf(file: File): Promise<RevisionPack> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/api/analyze-lecture`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Analysis failed' }));
    throw new Error(errorData.detail || 'Failed to analyze lecture PDF');
  }

  return await res.json();
}

/**
 * Computes diagnostic feedback from actual quiz answers.
 * Guarantees zero latency and avoids network delays right after quiz submission.
 */
export function computeLocalDiagnostic(
  quiz: QuizQuestion[],
  answers: Record<string, number>
): QuizDiagnosticResult {
  const topicsMap: Record<
    string,
    { title: string; total: number; correct: number }
  > = {};

  let score = 0;
  const total = quiz.length;

  quiz.forEach((q) => {
    if (!topicsMap[q.topic_id]) {
      topicsMap[q.topic_id] = {
        title: q.topic_title,
        total: 0,
        correct: 0,
      };
    }

    topicsMap[q.topic_id].total += 1;
    const selectedAnswer = answers[q.id];
    if (selectedAnswer !== undefined && selectedAnswer === q.correct_answer_index) {
      score += 1;
      topicsMap[q.topic_id].correct += 1;
    }
  });

  const percentage = total > 0 ? Math.round((score / total) * 1000) / 10 : 0;
  const topicsBreakdown: TopicDiagnostic[] = [];
  const strongAreas: string[] = [];
  const needsReview: string[] = [];
  const whatToReviseNext: string[] = [];

  Object.entries(topicsMap).forEach(([tId, data]) => {
    const mastery = data.total > 0 ? Math.round((data.correct / data.total) * 1000) / 10 : 0;
    let status: "MASTERED" | "NEEDS_REVIEW" | "CRITICAL_GAP";
    let recommendation: string;

    if (mastery >= 80) {
      status = "MASTERED";
      recommendation = "Solid conceptual mastery. You can confidently apply this core principle.";
      strongAreas.push(data.title);
    } else if (mastery >= 50) {
      status = "NEEDS_REVIEW";
      recommendation = "Review core definitions and key formulas to eliminate confusion on edge cases.";
      needsReview.push(data.title);
      whatToReviseNext.push(`Revisit "${data.title}" to clarify edge case distinctions.`);
    } else {
      status = "CRITICAL_GAP";
      recommendation = "High priority: Revisit the source lecture concepts and review Common Confusion Points.";
      needsReview.push(data.title);
      whatToReviseNext.push(`Foundational Gap: Prioritize re-reading "${data.title}".`);
    }

    topicsBreakdown.push({
      topic_id: tId,
      topic_title: data.title,
      total_questions: data.total,
      correct_questions: data.correct,
      mastery_percentage: mastery,
      status,
      recommendation,
    });
  });

  if (whatToReviseNext.length === 0) {
    whatToReviseNext.push("All evaluated topics mastered! Ready for advanced applications.");
  }

  return {
    total_questions: total,
    score,
    percentage,
    strong_areas: strongAreas,
    needs_review: needsReview,
    topics_breakdown: topicsBreakdown,
    what_to_revise_next: whatToReviseNext,
  };
}
