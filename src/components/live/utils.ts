import type { BroadcastItem, RawBroadcastItem } from './types';

export function parseClock(value: string | undefined): string {
  return value ?? '--:--:--';
}

export function normalizeBroadcasts(items: RawBroadcastItem[]): BroadcastItem[] {
  const grouped = new Map<string, BroadcastItem>();

  for (const item of items) {
    if (!item?.tour?.id || !item?.round?.id) {
      continue;
    }

    const existing = grouped.get(item.tour.id);

    if (existing) {
      const alreadyExists = existing.rounds.some((round) => round.id === item.round.id);

      if (!alreadyExists) {
        existing.rounds.push(item.round);
      }

      continue;
    }

    grouped.set(item.tour.id, {
      tour: item.tour,
      rounds: [item.round],
      defaultRoundId: item.round.id,
      group: item.group,
    });
  }

  return Array.from(grouped.values());
}