import type { SrsCard } from "../types";

const MIN_EASE = 1.3;
const MAX_EASE = 2.7;
const DAY_MS = 86_400_000;

export type SrsGrade = "again" | "hard" | "good" | "easy";

export function newSrsCard(now = Date.now()): SrsCard {
  return {
    ease: 2.3,
    interval: 0,
    repetitions: 0,
    dueAt: now,
    lapses: 0,
    lastResult: null,
    lastReviewedAt: null,
    accuracy: 1,
    attempts: 0,
    correct: 0,
    hintUsed: false,
  };
}

function clampEase(ease: number): number {
  return Math.min(MAX_EASE, Math.max(MIN_EASE, ease));
}

function rollingAccuracy(card: SrsCard, correct: boolean): number {
  const prev = card.accuracy;
  const next = correct ? 1 : 0;
  if (card.attempts === 0) return next;
  return prev * 0.82 + next * 0.18;
}

export function reviewCard(
  card: SrsCard,
  grade: SrsGrade,
  now = Date.now(),
): SrsCard {
  let { ease, interval, repetitions, lapses } = card;
  const correct = grade !== "again";

  if (grade === "again") {
    repetitions = 0;
    interval = 10 / 1440; // 10 წუთი
    ease = clampEase(ease - 0.22);
    lapses += 1;
  } else if (grade === "hard") {
    repetitions += 1;
    ease = clampEase(ease - 0.12);
    interval = repetitions === 1 ? 0.5 : Math.max(1, interval * 1.2);
  } else if (grade === "good") {
    repetitions += 1;
    if (repetitions === 1) interval = 1;
    else if (repetitions === 2) interval = 3;
    else interval = interval * ease;
  } else {
    repetitions += 1;
    ease = clampEase(ease + 0.12);
    if (repetitions === 1) interval = 2;
    else if (repetitions === 2) interval = 5;
    else interval = interval * ease * 1.35;
  }

  interval = Math.min(interval, 180);

  return {
    ...card,
    ease,
    interval,
    repetitions,
    lapses,
    dueAt: now + Math.round(interval * DAY_MS),
    lastResult: grade,
    lastReviewedAt: now,
    accuracy: rollingAccuracy(card, correct),
    attempts: card.attempts + 1,
    correct: card.correct + (correct ? 1 : 0),
    hintUsed: false,
  };
}

export function gradeFromAttempt(opts: {
  mistakes: number;
  hintLevel: number;
  usedSolution: boolean;
}): SrsGrade {
  if (opts.usedSolution || opts.mistakes >= 2) return "again";
  if (opts.mistakes === 1 || opts.hintLevel >= 2) return "hard";
  if (opts.hintLevel === 1) return "good";
  return "easy";
}