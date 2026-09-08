"use client";

import { usePuzzleStore } from "@/stores/puzzle-store";

export function MoveList() {
  const { puzzle, sanHistory } = usePuzzleStore();

  if (!puzzle) {
    return (
      <div className="flex min-h-[10rem] flex-1 flex-col rounded-xl border border-border-subtle bg-bg-surface p-4 shadow-panel">
        <h2 className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
          Move list
        </h2>
        <div className="mt-2 flex-1">
          <span className="italic text-text-muted">
            Moves will appear here.
          </span>
        </div>
      </div>
    );
  }

  // Build move numbers with SAN prefixes
  const fenParts = puzzle.fen.split(" ");
  const blackFirst = fenParts[1] === "b";
  const startNum = Number(fenParts[5] || 1);

  const movesWithNumbers = sanHistory.map((san, index) => {
    let prefix = "";
    if (blackFirst) {
      if (index === 0) prefix = `${startNum}... `;
      else if ((index - 1) % 2 === 0)
        prefix = `${startNum + 1 + Math.floor((index - 1) / 2)}. `;
    } else {
      if (index % 2 === 0)
        prefix = `${startNum + Math.floor(index / 2)}. `;
    }
    return { prefix, san };
  });

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