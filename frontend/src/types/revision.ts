export type TopicPriority = "HIGH" | "MEDIUM" | "LOW";

export interface KeyConcept {
  id: string;
  name: string;
  definition: string;
  importance_summary: string;
  source_page?: number | null;
}

export interface RevisionTopic {
  id: string;
  title: string;
  priority: TopicPriority;
  why_important: string;
  core_summary: string;
  key_formulas_or_rules?: string[];
  source_page?: number | null;
  source_section?: string | null;
}

export interface ConfusionPoint {
  id: string;
  topic_ref: string;
  concept_a: string;
  concept_b: string;
  key_distinction: string;
  common_misconception: string;
  source_page?: number | null;
}

export interface Flashcard {
  id: string;
  topic_id: string;
  front: string;
  back: string;
  hint?: string | null;
}

export interface QuizQuestion {
  id: string;
  topic_id: string;
  topic_title: string;
  question: string;
  options: string[];
  correct_answer_index: number;
  explanation: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

export interface ExecutiveSummary {
  overview: string;
  key_takeaways: string[];
  foundational_prerequisites: string[];
}

export interface LectureMetadata {
  title: string;
  subject: string;
  total_pages_detected: number;
  estimated_study_time_mins: number;
  has_reliable_page_numbers: boolean;
}

export interface RevisionPack {
  metadata: LectureMetadata;
  executive_summary: ExecutiveSummary;
  key_concepts: KeyConcept[];
  high_priority_topics: RevisionTopic[];
  common_confusion_points: ConfusionPoint[];
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
}

export interface QuizSubmissionAnswer {
  question_id: string;
  selected_option_index: number;
}

export interface TopicDiagnostic {
  topic_id: string;
  topic_title: string;
  total_questions: number;
  correct_questions: number;
  mastery_percentage: number;
  status: "MASTERED" | "NEEDS_REVIEW" | "CRITICAL_GAP";
  recommendation: string;
  source_page?: number | null;
}

export interface QuizDiagnosticResult {
  total_questions: number;
  score: number;
  percentage: number;
  strong_areas: string[];
  needs_review: string[];
  topics_breakdown: TopicDiagnostic[];
  what_to_revise_next: string[];
}

export interface SampleLectureSummary {
  id: string;
  title: string;
  subject: string;
  total_pages: number;
  estimated_study_time_mins: number;
  total_topics: number;
  total_concepts: number;
  total_questions: number;
}
