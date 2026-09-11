import { useMemo } from 'react';
import { mainlineChild, type Chapter, type TrainerMode, type TreeNode } from '@/lib/chess';
import type { DrillSession } from '../types';
import { nextLineNode } from '@/lib/chess/training';

export function useHintSquares(
  mode: TrainerMode,
  drill: DrillSession | null,
  chapter: Chapter | undefined,
  node: TreeNode | undefined,
): { from?: string; to?: string } {
  return useMemo(() => {
    if (mode !== 'drill' || !drill || !chapter || !node || drill.hintLevel === 0) return {};
    const expected = nextLineNode(chapter, drill.line, node.id) ?? mainlineChild(chapter, node.id);
    if (!expected?.move) return {};
    if (drill.hintLevel === 1) return { from: expected.move.from };
    return { from: expected.move.from, to: expected.move.to };
  }, [mode, drill, chapter, node]);
}
