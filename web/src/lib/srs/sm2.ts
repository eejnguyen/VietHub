export interface SM2Input {
  quality: number; // 0-5 (0=blackout, 5=perfect)
  repetitions: number;
  easinessFactor: number;
  interval: number; // days
}

export interface SM2Output {
  repetitions: number;
  easinessFactor: number;
  interval: number;
  nextReviewDate: Date;
}

export function sm2(input: SM2Input): SM2Output {
  const { quality, repetitions, easinessFactor, interval } = input;

  let newEF =
    easinessFactor +
    (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  newEF = Math.max(1.3, newEF);

  let newInterval: number;
  let newRepetitions: number;

  if (quality < 3) {
    newRepetitions = 0;
    newInterval = 1;
  } else {
    newRepetitions = repetitions + 1;
    if (newRepetitions === 1) {
      newInterval = 1;
    } else if (newRepetitions === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * newEF);
    }
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

  return {
    repetitions: newRepetitions,
    easinessFactor: newEF,
    interval: newInterval,
    nextReviewDate,
  };
}
