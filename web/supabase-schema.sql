-- =============================================================================
-- VietAgent Supabase Schema
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Profiles (auto-created on signup)
-- ---------------------------------------------------------------------------
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  dialect TEXT DEFAULT 'southern',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  streak_current INTEGER DEFAULT 0,
  streak_longest INTEGER DEFAULT 0,
  last_activity_date DATE,
  total_xp INTEGER DEFAULT 0
);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ---------------------------------------------------------------------------
-- 2. Lesson Progress
-- ---------------------------------------------------------------------------
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  unit_slug TEXT NOT NULL,
  lesson_slug TEXT NOT NULL,
  status TEXT DEFAULT 'not_started',
  score NUMERIC(5,2),
  completed_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ DEFAULT now(),
  attempts INTEGER DEFAULT 0,
  UNIQUE(user_id, unit_slug, lesson_slug)
);

CREATE INDEX idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_status ON lesson_progress(user_id, status);

-- ---------------------------------------------------------------------------
-- 3. Vocabulary Progress (SM-2 Spaced Repetition)
-- ---------------------------------------------------------------------------
CREATE TABLE vocabulary_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  vocab_key TEXT NOT NULL,
  easiness_factor NUMERIC(4,2) DEFAULT 2.50,
  interval INTEGER DEFAULT 0,
  repetitions INTEGER DEFAULT 0,
  next_review_date DATE DEFAULT CURRENT_DATE,
  last_review_date DATE,
  times_reviewed INTEGER DEFAULT 0,
  times_correct INTEGER DEFAULT 0,
  introduced_in_lesson TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, vocab_key)
);

CREATE INDEX idx_vocab_progress_user ON vocabulary_progress(user_id);
CREATE INDEX idx_vocab_progress_review ON vocabulary_progress(user_id, next_review_date);

-- ---------------------------------------------------------------------------
-- 4. Exercise Results
-- ---------------------------------------------------------------------------
CREATE TABLE exercise_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  lesson_slug TEXT NOT NULL,
  exercise_type TEXT NOT NULL,
  question_key TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  user_answer TEXT,
  correct_answer TEXT,
  time_spent_ms INTEGER,
  attempted_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_exercise_results_user ON exercise_results(user_id);
CREATE INDEX idx_exercise_results_lesson ON exercise_results(user_id, lesson_slug);

-- ---------------------------------------------------------------------------
-- 5. Audio Cache
-- ---------------------------------------------------------------------------
CREATE TABLE audio_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text_content TEXT NOT NULL,
  voice_name TEXT DEFAULT 'vi-VN-Wavenet-A',
  storage_path TEXT NOT NULL,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(text_content, voice_name)
);

CREATE INDEX idx_audio_cache_text ON audio_cache(text_content);

-- ---------------------------------------------------------------------------
-- 6. Row-Level Security
-- ---------------------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users manage own lesson progress" ON lesson_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own vocabulary progress" ON vocabulary_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own exercise results" ON exercise_results
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Audio cache public read" ON audio_cache
  FOR SELECT USING (true);

-- ---------------------------------------------------------------------------
-- 7. Storage Bucket for Audio
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) VALUES ('audio', 'audio', true);
