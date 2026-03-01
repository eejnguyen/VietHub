"use client";

import { useState } from "react";
import type { Exercise } from "@/types/curriculum";

interface ToneMatchingProps {
  exercise: Exercise;
  onAnswer: (correct: boolean) => void;
}

export default function ToneMatching({ exercise, onAnswer }: ToneMatchingProps) {
  const pairs = exercise.pairs || [];
  const [currentPair, setCurrentPair] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);

  if (pairs.length === 0) return null;

  const pair = pairs[currentPair];

  function handleSelect(option: string) {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
    const isCorrect = option === pair.correct;
    const newCount = isCorrect ? correctCount + 1 : correctCount;
    setCorrectCount(newCount);

    setTimeout(() => {
      if (currentPair + 1 < pairs.length) {
        setCurrentPair((i) => i + 1);
        setSelected(null);
        setAnswered(false);
      } else {
        setDone(true);
        onAnswer(newCount === pairs.length);
      }
    }, 1000);
  }

  if (done) {
    return (
      <div className="text-center py-4">
        <p className="text-lg font-medium">
          {correctCount === pairs.length
            ? "Perfect tone matching!"
            : `${correctCount}/${pairs.length} correct`}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h4 className="text-lg font-medium">
        {exercise.instruction || "Match the correct tone:"}
      </h4>
      <p className="mt-1 text-xs text-muted">
        {currentPair + 1} of {pairs.length}
      </p>

      <p className="mt-4 text-center text-3xl viet-text font-bold">{pair.word}</p>

      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {pair.options.map((option) => {
          let classes =
            "rounded-lg border px-6 py-3 text-lg font-medium viet-text transition-all cursor-pointer ";

          if (!answered) {
            classes += "border-border hover:border-primary/50 hover:bg-primary/5";
          } else if (option === pair.correct) {
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
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
