import type { SrsCard } from "../types";

const DAY_MS = 86_400_000;

export function nextReviewLabel(card: SrsCard, now = Date.now()): string {
  const ms = card.dueAt - now;
  if (ms <= 0) return "due now";

  const minutes = Math.round(ms / 60_000);
  if (minutes < 60) return `in ${Math.max(1, minutes)}m`;

  const hours = Math.round(ms / 3_600_000);
  if (hours < 24) return `in ${hours}h`;

  const days = Math.round(ms / DAY_MS);
  if (days === 1) return "in 1 day";
  return `in ${days} days`;
}