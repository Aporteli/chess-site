import { childNodes, type Chapter, type TreeNode } from "@/lib/chess";
import type { TurnRow } from "./types";

/**
 * Groups mainline moves into turn rows (1. e4 e5, 2. Nf3 Nc6…)
 * and attaches the non-mainline siblings as alternatives.
 */
export function groupTurns(chapter: Chapter, nodes: TreeNode[]): TurnRow[] {
  const turns: TurnRow[] = [];

  for (const n of nodes) {
    const turnNumber = Math.ceil(n.ply / 2);
    const parent = chapter.nodes[n.parentId!];
    const siblings = parent
      ? childNodes(chapter, parent.id).filter((s) => s.id !== n.id)
      : [];

    let row = turns.find((r) => r.turnNumber === turnNumber);
    if (!row) {
      row = { turnNumber };
      turns.push(row);
    }

    if (n.ply % 2 === 1) {
      row.white = n;
      row.whiteParentFen = parent?.fen;
      row.whiteSiblings = siblings;
    } else {
      row.black = n;
      row.blackParentFen = parent?.fen;
      row.blackSiblings = siblings;
    }
  }

  return turns;
}