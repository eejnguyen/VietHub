"use client";

import { useState } from "react";
import type { Exercise } from "@/types/curriculum";
import AudioButton from "@/components/lesson/AudioButton";

interface MultipleChoiceProps {
  exercise: Exercise;
  onAnswer: (correct: boolean) => void;
}

export default function MultipleChoice({ exercise, onAnswer }: MultipleChoiceProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  function handleSelect(option: string) {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
    const correct = option === exercise.correctAnswer;
    onAnswer(correct);
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        {exercise.audioFile !== undefined && (
          <AudioButton src={exercise.audioFile ?? null} label={exercise.question} size="lg" />
        )}
        <h4 className="text-lg font-medium">{exercise.question}</h4>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {exercise.options?.map((option) => {
          let classes =
            "rounded-lg border px-4 py-3 text-left text-sm font-medium transition-all cursor-pointer ";

          if (!answered) {
            classes += "border-border hover:border-primary/50 hover:bg-primary/5";
          } else if (option === exercise.correctAnswer) {
            classes += "border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300";
          } else if (option === selected) {
            classes += "border-red-400 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300";
          } else {
            classes += "border-border opacity-50";
          }

          return (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              disabled={answered}
              className={classes}
            >
              <span className="viet-text">{option}</span>
            </button>
          );
        })}
      </div>

      {answered && exercise.explanation && (
        <p className="mt-3 text-sm text-muted italic">{exercise.explanation}</p>
      )}
    </div>
  );
}
