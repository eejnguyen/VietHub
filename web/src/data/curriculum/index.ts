import type { CurriculumManifest } from "@/types/curriculum";

export const curriculum: CurriculumManifest = {
  units: [
    {
      slug: "unit-1-pronunciation",
      title: "Pronunciation Foundation",
      titleVi: "Phát Âm Cơ Bản",
      description:
        "Vietnamese alphabet, vowels, consonants, and the 6 tones — Southern dialect focus.",
      order: 1,
      lessons: [
        "lesson-01-alphabet",
        "lesson-02-single-vowels",
        "lesson-03-double-vowels",
        "lesson-04-triple-vowels",
        "lesson-05-consonants-1",
        "lesson-06-consonants-2",
        "lesson-07-final-consonants",
        "lesson-08-tones",
        "lesson-09-tones-southern",
      ],
    },
    {
      slug: "unit-2-basic-vocab",
      title: "Basic Vocabulary",
      titleVi: "Từ Vựng Cơ Bản",
      description:
        "Family, food, numbers, colors, body parts, household items, and common verbs.",
      order: 2,
      lessons: [
        "lesson-01-family",
        "lesson-02-food",
        "lesson-03-numbers",
        "lesson-04-colors",
        "lesson-05-body-parts",
        "lesson-06-household",
        "lesson-07-common-verbs",
      ],
    },
    {
      slug: "unit-3-basic-phrases",
      title: "Basic Phrases",
      titleVi: "Câu Nói Cơ Bản",
      description:
        "Greetings, polite expressions, ordering food, asking directions, time, self-introduction.",
      order: 3,
      lessons: [
        "lesson-01-greetings",
        "lesson-02-polite-expressions",
        "lesson-03-ordering-food",
        "lesson-04-directions",
        "lesson-05-time",
        "lesson-06-self-introduction",
      ],
    },
    {
      slug: "unit-4-grammar",
      title: "Grammar Fundamentals",
      titleVi: "Ngữ Pháp Cơ Bản",
      description:
        "Sentence structure, classifiers, question words, negation, tense markers, pronouns.",
      order: 4,
      lessons: [
        "lesson-01-sentence-structure",
        "lesson-02-classifiers",
        "lesson-03-question-words",
        "lesson-04-negation",
        "lesson-05-tense-markers",
        "lesson-06-pronouns",
      ],
    },
    {
      slug: "unit-5-intermediate",
      title: "Intermediate",
      titleVi: "Trung Cấp",
      description:
        "Emotions, weather, occupations, describing things, opinions, daily routine.",
      order: 5,
      lessons: [
        "lesson-01-emotions",
        "lesson-02-weather",
        "lesson-03-occupations",
        "lesson-04-describing",
        "lesson-05-opinions",
        "lesson-06-daily-routine",
      ],
    },
    {
      slug: "unit-6-conversational",
      title: "Conversational Practice",
      titleVi: "Luyện Hội Thoại",
      description:
        "Real-world dialogues: market, family dinner, phone calls, celebrations, visiting Vietnam.",
      order: 6,
      lessons: [
        "lesson-01-at-the-market",
        "lesson-02-family-dinner",
        "lesson-03-phone-calls",
        "lesson-04-celebrations",
        "lesson-05-visiting-vietnam",
      ],
    },
    {
      slug: "unit-7-advanced",
      title: "Advanced",
      titleVi: "Nâng Cao",
      description:
        "Idioms, proverbs, formal vs informal registers, cultural context, extended listening.",
      order: 7,
      lessons: [
        "lesson-01-idioms",
        "lesson-02-formal-informal",
        "lesson-03-cultural-context",
        "lesson-04-extended-listening",
      ],
    },
  ],
};
