import Link from "next/link";
import ToneDiagram from "@/components/lesson/ToneDiagram";

const vowels = [
  { letter: "a", ipa: "/aː/", example: "ba (dad)", notes: "Open, like English 'father'" },
  { letter: "ă", ipa: "/a/", example: "ăn (eat)", notes: "Short, like English 'cut'" },
  { letter: "â", ipa: "/ə/", example: "ân (grace)", notes: "Short schwa, like 'uh'" },
  { letter: "e", ipa: "/ɛ/", example: "em (younger sibling)", notes: "Like English 'bet'" },
  { letter: "ê", ipa: "/e/", example: "mê (obsessed)", notes: "Like French 'é'" },
  { letter: "i/y", ipa: "/i/", example: "đi (go)", notes: "Like English 'see'" },
  { letter: "o", ipa: "/ɔ/", example: "con (child)", notes: "Like English 'law'" },
  { letter: "ô", ipa: "/o/", example: "cô (aunt)", notes: "Like English 'go' (no glide)" },
  { letter: "ơ", ipa: "/əː/", example: "mơ (dream)", notes: "Long schwa, no English equivalent" },
  { letter: "u", ipa: "/u/", example: "tú (fine)", notes: "Like English 'too'" },
  { letter: "ư", ipa: "/ɯ/", example: "từ (word)", notes: "Unrounded 'u' — smile while saying 'oo'" },
];

const southernConsonants = [
  { combo: "d", sound: "/j/", note: "Sounds like English 'y' in Southern" },
  { combo: "gi", sound: "/j/", note: "Also /j/ in Southern — merges with d" },
  { combo: "v", sound: "/j/ or /v/", note: "Often /j/ in Southern speech" },
  { combo: "tr", sound: "/tʂ/ or /t/", note: "Often sounds like 'ch' or 't' in Southern" },
  { combo: "ch", sound: "/tɕ/", note: "Can merge with tr in casual Southern speech" },
  { combo: "r", sound: "/ɹ/ or /ʐ/", note: "Retroflex in Southern (curled tongue)" },
  { combo: "s", sound: "/ʂ/ or /s/", note: "Retroflex or flat 's' in Southern" },
];

export default function PronunciationPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Pronunciation Guide</h1>
      <p className="mt-1 text-muted">
        Quick reference for Vietnamese sounds — Southern dialect.
      </p>

      {/* Tones */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold">Tones (Southern)</h2>
        <p className="mt-1 text-sm text-muted">
          Southern Vietnamese effectively uses 5 tones (hỏi and ngã merge).
        </p>
        <div className="mt-4">
          <ToneDiagram showAll dialect="southern" />
        </div>
        <div className="mt-4">
          <Link
            href="/learn/unit-1-pronunciation/lesson-09-tones-southern"
            className="text-sm text-primary hover:underline"
          >
            Full lesson on Southern tones &rarr;
          </Link>
        </div>
      </section>

      {/* Vowels */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold">Vowels</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 pr-4 font-medium">Letter</th>
                <th className="pb-2 pr-4 font-medium">IPA</th>
                <th className="pb-2 pr-4 font-medium">Example</th>
                <th className="pb-2 font-medium">Sound</th>
              </tr>
            </thead>
            <tbody>
              {vowels.map((v) => (
                <tr key={v.letter} className="border-b border-border/50">
                  <td className="py-2 pr-4 viet-text text-lg font-bold">{v.letter}</td>
                  <td className="py-2 pr-4 font-mono text-muted">{v.ipa}</td>
                  <td className="py-2 pr-4 viet-text">{v.example}</td>
                  <td className="py-2 text-muted">{v.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3">
          <Link
            href="/learn/unit-1-pronunciation/lesson-02-single-vowels"
            className="text-sm text-primary hover:underline"
          >
            Full vowel lessons &rarr;
          </Link>
        </div>
      </section>

      {/* Southern consonant differences */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold">Southern Consonant Differences</h2>
        <p className="mt-1 text-sm text-muted">
          These are the sounds you hear from your parents — how Southern Vietnamese
          pronounces consonants differently from the &quot;standard&quot; Northern dialect.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 pr-4 font-medium">Letter(s)</th>
                <th className="pb-2 pr-4 font-medium">Southern Sound</th>
                <th className="pb-2 font-medium">Note</th>
              </tr>
            </thead>
            <tbody>
              {southernConsonants.map((c) => (
                <tr key={c.combo} className="border-b border-border/50">
                  <td className="py-2 pr-4 viet-text text-lg font-bold">{c.combo}</td>
                  <td className="py-2 pr-4 font-mono text-muted">{c.sound}</td>
                  <td className="py-2 text-muted">{c.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3">
          <Link
            href="/learn/unit-1-pronunciation/lesson-05-consonants-1"
            className="text-sm text-primary hover:underline"
          >
            Full consonant lessons &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
