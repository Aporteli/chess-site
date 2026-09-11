import type { SrsCard } from "../types";

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