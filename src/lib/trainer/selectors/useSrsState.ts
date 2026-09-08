import { useMemo } from 'react';
import { srsLevel, type Chapter, type TreeNode } from '@/lib/chess';
import type { SrsState } from '@/lib/types';
import type { DrillSession } from '../types';

export function useSrsState(
  node: TreeNode | undefined,
  chapter: Chapter | undefined,
  drill: DrillSession | null,
): SrsState {
  return useMemo(() => {
    const card = node?.srs;
    const trainable = chapter ? Object.values(chapter.nodes).filter((n) => n.move) : [];
    const avgAcc =
      trainable.length === 0
        ? 0
        : Math.round((trainable.reduce((sum, n) => sum + n.srs.accuracy, 0) / trainable.length) * 100);
    return {
      level: card ? srsLevel(card) : 0,
      maxLevel: 8,
      nextReviewInDays: card?.lastReviewedAt ? Math.round(card.interval) : 0,
      streakDays: drill?.correctLines ?? 0,
      accuracyPct: avgAcc,
    };
  }, [node, chapter, drill]);
}
