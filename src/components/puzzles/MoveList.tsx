"use client";

import { useMemo } from "react";
import { usePuzzleStore } from "@/stores/puzzle-store";
import { formatSanHistory } from "@/lib/puzzles/format-moves";
import { MoveListEmpty } from "@/components/puzzles/MoveListEmpty";

export function MoveList() {
  const { puzzle, sanHistory } = usePuzzleStore();

  const movesWithNumbers = useMemo(() => {
    if (!puzzle) return [];
    return formatSanHistory(puzzle.fen, sanHistory);
  }, [puzzle, sanHistory]);

  if (!puzzle) {
    return <MoveListEmpty />;
  }

  return (
    <div className="flex min-h-[10rem] flex-1 flex-col rounded-xl border border-border-subtle bg-bg-surface p-4 shadow-panel">
      <h2 className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
        Move list
      </h2>
      <div className="mt-2 flex min-h-0 flex-1 flex-wrap content-start gap-1.5 font-mono text-xs">
        {movesWithNumbers.length === 0 ? (
          <span className="italic text-text-muted">
            Play the winning line on the board.
          </span>
        ) : (
          movesWithNumbers.map(({ prefix, san }, index) => (
            <span
              key={`${san}-${index}`}
              className="rounded-md border border-border-subtle bg-bg-elevated px-1.5 py-0.5 text-text-secondary"
            >
              {prefix}
              {san}
            </span>
          ))
        )}
      </div>
    </div>
  );
}