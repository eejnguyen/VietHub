export interface VocabularyItem {
  key: string;
  vietnamese: string;
  english: string;
  ipa: string;
  audioFile: string | null;
  /** Override text sent to TTS — use to demonstrate Southern pronunciation via phonetic substitution */
  ttsText?: string;
  notes?: string;
  exampleSentence?: {
    vietnamese: string;
    english: string;
    audioFile: string | null;
  };
}

export interface InstructionSection {
  type: "instruction";
  content: string;
}

export interface VocabularySection {
  type: "vocabulary";
  items: VocabularyItem[];
}

export interface CulturalNoteSection {
  type: "cultural_note";
  content: string;
}

export type LessonSection =
  | InstructionSection
  | VocabularySection
  | CulturalNoteSection;

export interface Exercise {
  type: "multiple_choice" | "fill_blank" | "tone_matching" | "listening" | "type_vietnamese";
  key: string;
  question?: string;
  instruction?: string;
  audioFile?: string | null;
  options?: string[];
  correctAnswer?: string;
  acceptableAnswers?: string[];
  explanation?: string;
  sentence?: string;
  english?: string;
  pairs?: Array<{
    word: string;
    options: string[];
    correct: string;
  }>;
}

export interface Lesson {
  slug: string;
  unitSlug: string;
  title: string;
  titleVi: string;
  description: string;
  order: number;
  estimatedMinutes: number;
  sections: LessonSection[];
  exercises: Exercise[];
}

export interface UnitMeta {
  slug: string;
  title: string;
  titleVi: string;
  description: string;
  order: number;
  lessons: string[]; // lesson slugs in order
}

export interface CurriculumManifest {
  units: UnitMeta[];
}
