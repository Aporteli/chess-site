import { useMemo } from 'react';
import { inCheck, legalMovesFrom, lookupMaster } from '@/lib/chess';
import type { TreeNode } from '@/lib/chess';

/** { from, to } of the move that led to the current node, or null at the root. */
export function useLastMove(node: TreeNode | undefined) {
  return node?.move ? { from: node.move.from, to: node.move.to } : null;
}

/** Master-game statistics for the current FEN. */
export function useMasterReference(fen: string) {
  return lookupMaster(fen);
}

/** Destination squares reachable from the currently selected square. */
export function useLegalTargets(selectedSquare: string | null, node: TreeNode | undefined) {
  return useMemo(() => {
    if (!selectedSquare || !node) return [];
    try {
      return legalMovesFrom(node.fen, selectedSquare).map((m) => m.to);
    } catch {
      return [];
    }
  }, [selectedSquare, node]);
}

/** The square holding the king currently in check, or null. */
export function useCheckSquare(fen: string) {
  return useMemo(() => {
    try {
      if (!inCheck(fen)) return null;
      const [board, turn] = fen.split(' ');
      const king = turn === 'w' ? 'K' : 'k';
      const ranks = board?.split('/') ?? [];
      for (let r = 0; r < 8; r++) {
        let fileIdx = 0;
        for (const ch of ranks[r] ?? '') {
          if (/\d/.test(ch)) {
            fileIdx += Number(ch);
          } else {
            if (ch === king) return `${'abcdefgh'[fileIdx]}${8 - r}`;
            fileIdx += 1;
          }
        }
      }
      return null;
    } catch {
      return null;
    }
  }, [fen]);
}
