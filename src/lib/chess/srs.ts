import type { SrsCard } from "./types";

const MIN_EASE = 1.3;
const MAX_EASE = 2.7;

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

export type SrsGrade = "again" | "hard" | "good" | "easy";

function clampEase(ease: number) {
  return Math.min(MAX_EASE, Math.max(MIN_EASE, ease));
}

function rollingAccuracy(card: SrsCard, correct: boolean): number {
  const prev = card.accuracy;
  const next = correct ? 1 : 0;
  if (card.attempts === 0) return next;
  return prev * 0.82 + next * 0.18;
}

/** SM-2 variant tuned for opening lines: short first intervals, lapse-aware. */
export function reviewCard(
  card: SrsCard,
  grade: SrsGrade,
  now = Date.now(),
): SrsCard {
  const day = 86_400_000;
  let { ease, interval, repetitions, lapses } = card;
  const correct = grade !== "again";

  if (grade === "again") {
    repetitions = 0;
    interval = 0;
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
    dueAt: now + interval * day,
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

export function isDue(card: SrsCard, now = Date.now()): boolean {
  return card.dueAt <= now;
}

export function isWeak(card: SrsCard): boolean {
  return (
    card.lapses > 0 ||
    (card.attempts >= 2 && card.accuracy < 0.72) ||
    card.ease < 1.9
  );
}

export function isNew(card: SrsCard): boolean {
  return card.attempts === 0;
}

export function masteryPct(card: SrsCard): number {
  if (card.attempts === 0) return 0;
  const intervalScore = Math.min(1, card.interval / 21);
  const acc = card.accuracy;
  const lapsePenalty = Math.min(0.35, card.lapses * 0.08);
  return Math.max(0, Math.min(1, acc * 0.55 + intervalScore * 0.45 - lapsePenalty));
}

export function srsLevel(card: SrsCard): number {
  return Math.round(masteryPct(card) * 8);
}

export function nextReviewLabel(card: SrsCard, now = Date.now()): string {
  const ms = card.dueAt - now;
  if (ms <= 0) return "due now";
  const hours = ms / 3_600_000;
  if (hours < 18) return `in ${Math.max(1, Math.round(hours))}h`;
  const days = Math.round(ms / 86_400_000);
  if (days === 1) return "in 1 day";
  return `in ${days} days`;
}
