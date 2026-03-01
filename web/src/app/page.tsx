import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
        Học Tiếng Việt
      </h1>
      <p className="mt-4 max-w-lg text-lg text-muted">
        A structured path from pronunciation to conversation.
        Built for heritage speakers who want to reclaim their language.
      </p>
      <p className="mt-2 text-sm text-muted">
        Southern dialect &middot; Audio-first &middot; Spaced repetition
      </p>

      <div className="mt-8 flex gap-4">
        <Link
          href="/learn"
          className="rounded-full bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary/90"
        >
          Start Learning
        </Link>
        <Link
          href="/pronunciation"
          className="rounded-full border border-border px-6 py-3 font-medium transition-colors hover:bg-border/30"
        >
          Pronunciation Guide
        </Link>
      </div>

      {/* Quick curriculum overview */}
      <div className="mt-16 grid w-full max-w-2xl gap-4 text-left sm:grid-cols-2">
        {[
          {
            unit: "1",
            title: "Pronunciation",
            desc: "Vowels, consonants, tones — Southern dialect",
            lessons: 9,
          },
          {
            unit: "2",
            title: "Basic Vocabulary",
            desc: "Family, food, numbers, common verbs",
            lessons: 7,
          },
          {
            unit: "3",
            title: "Basic Phrases",
            desc: "Greetings, ordering food, directions",
            lessons: 6,
          },
          {
            unit: "4",
            title: "Grammar",
            desc: "Classifiers, tense markers, pronouns",
            lessons: 6,
          },
          {
            unit: "5",
            title: "Intermediate",
            desc: "Emotions, opinions, daily routine",
            lessons: 6,
          },
          {
            unit: "6",
            title: "Conversational",
            desc: "Market, family dinner, phone calls",
            lessons: 5,
          },
        ].map((u) => (
          <div
            key={u.unit}
            className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {u.unit}
              </span>
              <h3 className="font-semibold">{u.title}</h3>
            </div>
            <p className="mt-1 text-sm text-muted">{u.desc}</p>
            <p className="mt-2 text-xs text-muted">{u.lessons} lessons</p>
          </div>
        ))}
      </div>
    </div>
  );
}
