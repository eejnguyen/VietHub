"use client";

import { useState } from "react";
import type { Exercise } from "@/types/curriculum";
import MultipleChoice from "./MultipleChoice";
import FillInTheBlank from "./FillInTheBlank";
import ToneMatching from "./ToneMatching";
import TypeVietnamese from "./TypeVietnamese";

interface ExerciseRouterProps {
  exercises: Exercise[];
  lessonSlug: string;
}

export default function ExerciseRouter({ exercises, lessonSlug }: ExerciseRouterProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<Array<{ key: string; correct: boolean }>>([]);
  const [finished, setFinished] = useState(false);

  if (exercises.length === 0) return null;

  const current = exercises[currentIndex];
  const total = exercises.length;
  const correctCount = results.filter((r) => r.correct).length;

  function handleAnswer(correct: boolean) {
    const newResults = [...results, { key: current.key, correct }];
    setResults(newResults);

    if (currentIndex + 1 < total) {
      setTimeout(() => setCurrentIndex((i) => i + 1), 1200);
    } else {
      setTimeout(() => setFinished(true), 1200);
    }
  }

  if (finished) {
    const score = Math.round((correctCount / total) * 100);
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <h3 className="text-2xl font-bold">
          {score >= 80 ? "Great job!" : score >= 50 ? "Good effort!" : "Keep practicing!"}
        </h3>
        <p className="mt-2 text-4xl font-bold text-primary">{score}%</p>
        <p className="mt-1 text-sm text-muted">
          {correctCount} of {total} correct
        </p>
        <button
          onClick={() => {
            setCurrentIndex(0);
            setResults([]);
            setFinished(false);
          }}
          className="mt-6 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex-1 h-2 rounded-full bg-border">
          <div
            className="h-2 rounded-full bg-primary transition-all"
            style={{ width: `${((currentIndex) / total) * 100}%` }}
          />
        </div>
        <span className="text-xs text-muted">
          {currentIndex + 1}/{total}
        </span>
      </div>

      {/* Exercise */}
      <div className="rounded-xl border border-border bg-card p-6">
        {(current.type === "multiple_choice" || current.type === "listening") && (
          <MultipleChoice key={current.key} exercise={current} onAnswer={handleAnswer} />
        )}
        {current.type === "fill_blank" && (
          <FillInTheBlank key={current.key} exercise={current} onAnswer={handleAnswer} />
        )}
        {current.type === "tone_matching" && (
          <ToneMatching key={current.key} exercise={current} onAnswer={handleAnswer} />
        )}
        {current.type === "type_vietnamese" && (
          <TypeVietnamese key={current.key} exercise={current} onAnswer={handleAnswer} />
        )}
      </div>
    </div>
  );
}
