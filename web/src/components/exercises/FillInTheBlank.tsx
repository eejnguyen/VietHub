"use client";

import { useState } from "react";
import type { Exercise } from "@/types/curriculum";

interface FillInTheBlankProps {
  exercise: Exercise;
  onAnswer: (correct: boolean) => void;
}

export default function FillInTheBlank({ exercise, onAnswer }: FillInTheBlankProps) {
  const [value, setValue] = useState("");
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (answered || !value.trim()) return;

    const trimmed = value.trim().toLowerCase();
    const acceptable = [
      exercise.correctAnswer?.toLowerCase(),
      ...(exercise.acceptableAnswers?.map((a) => a.toLowerCase()) || []),
    ].filter(Boolean);

    const isCorrect = acceptable.includes(trimmed);
    setCorrect(isCorrect);
    setAnswered(true);
    onAnswer(isCorrect);
  }

  return (
    <div>
      <h4 className="text-lg font-medium">{exercise.question || "Fill in the blank:"}</h4>

      {exercise.sentence && (
        <p className="mt-2 viet-text text-xl">
          {exercise.sentence.split("___").map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && (
                <span className="inline-block min-w-[80px] border-b-2 border-primary mx-1">
                  {answered ? (
                    <span className={correct ? "text-green-600" : "text-red-500"}>
                      {value}
                    </span>
                  ) : null}
                </span>
              )}
            </span>
          ))}
        </p>
      )}

      {exercise.english && (
        <p className="mt-1 text-sm text-muted">{exercise.english}</p>
      )}

      {!answered && (
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type your answer..."
            autoFocus
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            Check
          </button>
        </form>
      )}

      {answered && !correct && (
        <p className="mt-3 text-sm">
          Correct answer:{" "}
          <span className="viet-text font-semibold text-green-600">
            {exercise.correctAnswer}
          </span>
        </p>
      )}

      {answered && exercise.explanation && (
        <p className="mt-2 text-sm text-muted italic">{exercise.explanation}</p>
      )}
    </div>
  );
}
