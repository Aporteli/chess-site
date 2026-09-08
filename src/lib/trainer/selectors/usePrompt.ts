import { useMemo } from 'react';
import { formatLine, pathSans, type Chapter, type Repertoire, type TrainerMode, type TreeNode } from '@/lib/chess';
import type { TrainerPrompt } from '@/lib/types';
import type { DrillSession } from '../types';

export function usePrompt(
  repertoire: Repertoire | undefined,
  node: TreeNode | undefined,
  mode: TrainerMode,
  chapter: Chapter | undefined,
  drill: DrillSession | null,
): TrainerPrompt {
  return useMemo(() => {
    if (!repertoire || !node) {
      return { side: 'white', kind: 'info', text: 'Load a repertoire to begin.' };
    }

    if (mode === 'study') {
      if (node.comment) {
        return { side: repertoire.side, kind: 'info', text: node.comment };
      }
      if (!node.move) {
        return {
          side: repertoire.side,
          kind: 'question',
          text: `Study mode. Play moves on the board to grow the ${repertoire.side} tree. Right-click arrows to mark plans.`,
        };
      }
      return {
        side: repertoire.side,
        kind: 'info',
        text: node.annotation || `You are on ${formatLine(pathSans(chapter!, node.id)) || 'the starting position'}.`,
      };
    }

    if (!drill) {
      return { side: repertoire.side, kind: 'question', text: 'Start Training to play against your repertoire.' };
    }
    if (drill.lineComplete) {
      return {
        side: repertoire.side,
        kind: 'success',
        text: drill.sessionOver
          ? 'All lines completed! Entire tree practiced.'
          : 'Variation completed! Preparing next unvisited line...',
      };
    }
    if (drill.opponentThinking) {
      return { side: repertoire.side, kind: 'info', text: 'Opponent is choosing a book reply…' };
    }
    if (drill.awaitingRetry) {
      return {
        side: repertoire.side,
        kind: 'error',
        text: 'Not the repertoire move. Find the book continuation — the position stays until you correct it.',
      };
    }
    const you = repertoire.side === 'white' ? 'White' : 'Black';
    return {
      side: repertoire.side,
      kind: 'question',
      text: `${you} to move. Play your book move — the opponent will answer automatically.`,
    };
  }, [repertoire, node, mode, chapter, drill]);
}
