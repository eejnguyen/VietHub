export interface UserProfile {
  id: string;
  display_name: string | null;
  dialect: string;
  created_at: string;
  updated_at: string;
  streak_current: number;
  streak_longest: number;
  last_activity_date: string | null;
  total_xp: number;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  unit_slug: string;
  lesson_slug: string;
  status: "not_started" | "in_progress" | "completed";
  score: number | null;
  completed_at: string | null;
  started_at: string;
  attempts: number;
}

export interface VocabularyProgress {
  id: string;
  user_id: string;
  vocab_key: string;
  easiness_factor: number;
  interval: number;
  repetitions: number;
  next_review_date: string;
  last_review_date: string | null;
  times_reviewed: number;
  times_correct: number;
  introduced_in_lesson: string | null;
  created_at: string;
}

export interface ExerciseResult {
  id: string;
  user_id: string;
  lesson_slug: string;
  exercise_type: string;
  question_key: string;
  is_correct: boolean;
  user_answer: string | null;
  correct_answer: string | null;
  time_spent_ms: number | null;
  attempted_at: string;
}
