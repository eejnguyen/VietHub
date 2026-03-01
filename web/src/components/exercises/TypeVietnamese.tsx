"use client";

import { useState } from "react";
import type { Exercise } from "@/types/curriculum";

interface TypeVietnameseProps {
  exercise: Exercise;
  onAnswer: (correct: boolean) => void;
}

export default function TypeVietnamese({ exercise, onAnswer }: TypeVietnameseProps) {
  const [value, setValue] = useState("");
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (answered || !value.trim()) return;

    const trimmed = value.trim();
    const acceptable = [
      exercise.correctAnswer,
      ...(exercise.acceptableAnswers || []),
    ].filter(Boolean);

    // Case-insensitive comparison
    const isCorrect = acceptable.some(
      (a) => a!.toLowerCase() === trimmed.toLowerCase()
    );
    setCorrect(isCorrect);
    setAnswered(true);
    onAnswer(isCorrect);
  }

  return (
    <div>
      <h4 className="text-lg font-medium">
        {exercise.question || "Type in Vietnamese:"}
      </h4>

      {exercise.english && (
        <p className="mt-2 text-base text-muted">
          Translate: <span className="font-medium text-foreground">{exercise.english}</span>
        </p>
      )}

      {!answered && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type Vietnamese with diacritics..."
            autoFocus
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-lg viet-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <p className="text-xs text-muted">
            Tip: Use your system Vietnamese keyboard (Telex or VNI) for diacritics.
          </p>
          <button
            type="submit"
            className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            Check
          </button>
        </form>
      )}

      {answered && (
        <div className="mt-4">
          <div
            className={`rounded-lg p-4 ${
              correct
                ? "bg-green-50 dark:bg-green-950"
                : "bg-red-50 dark:bg-red-950"
            }`}
          >
            <p className="text-sm font-medium">
              {correct ? "Correct!" : "Not quite."}
            </p>
            {!correct && (
              <p className="mt-1 text-sm">
                Your answer: <span className="viet-text">{value}</span>
                <br />
                Correct:{" "}
                <span className="viet-text font-semibold text-green-600">
                  {exercise.correctAnswer}
                </span>
              </p>
            )}
          </div>
          {exercise.explanation && (
            <p className="mt-2 text-sm text-muted italic">{exercise.explanation}</p>
          )}
        </div>
      )}
    </div>
  );
}
