"use client";

import type { VocabularyItem } from "@/types/curriculum";
import AudioButton from "./AudioButton";

interface ExampleCardProps {
  item: VocabularyItem;
}

export default function ExampleCard({ item }: ExampleCardProps) {
  // Use explicit ttsText override if set (e.g. Southern phonetic substitution).
  // For alphabet entries like "A a" (two single-char parts), send just the lowercase.
  // For real vocabulary like "xanh dương", send the full text.
  const parts = item.vietnamese.split(" ");
  const isAlphabetEntry = parts.length === 2 && parts[0].length <= 2 && parts[1].length <= 2;
  const audioLabel = item.ttsText
    ? item.ttsText
    : isAlphabetEntry
    ? parts[1]
    : item.vietnamese;

  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/20">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="viet-text text-2xl font-bold">{item.vietnamese}</span>
            <AudioButton src={item.audioFile} label={audioLabel} />
          </div>
          <p className="mt-0.5 text-sm text-muted font-mono">{item.ipa}</p>
          <p className="mt-1 text-base">{item.english}</p>
          {item.notes && (
            <p className="mt-2 text-sm text-muted italic">{item.notes}</p>
          )}
        </div>
      </div>

      {item.exampleSentence && (
        <div className="mt-3 rounded-lg bg-background p-3">
          <div className="flex items-center gap-2">
            <span className="viet-text text-sm font-medium">
              {item.exampleSentence.vietnamese}
            </span>
            <AudioButton
              src={item.exampleSentence.audioFile}
              label={item.exampleSentence.vietnamese}
              size="sm"
            />
          </div>
          <p className="mt-0.5 text-xs text-muted">
            {item.exampleSentence.english}
          </p>
        </div>
      )}
    </div>
  );
}
