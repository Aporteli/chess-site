"use client";

import { Chessboard } from "react-chessboard";

export function MiniBoard({ fen }: { fen: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-border-default,#3a3122)] p-1.5 shadow-board wood-grain">
      <div className="h-64 w-64 overflow-hidden rounded-md ring-1 ring-black/40">
        <Chessboard
          key={fen}
          options={{
            id: "pv-preview-board",
            position: fen,
            allowDragging: false,
            allowDrawingArrows: false,
            showNotation: false,
            animationDurationInMs: 140,
            lightSquareStyle: {
              backgroundColor: "var(--color-board-light, #e8d9b5)",
              backgroundImage:
                "linear-gradient(155deg, rgba(255,255,255,0.12), transparent 55%)",
            },
            darkSquareStyle: {
              backgroundColor: "var(--color-board-dark, #7a4c2c)",
              backgroundImage:
                "linear-gradient(155deg, rgba(255,255,255,0.06), transparent 55%)",
            },
            boardStyle: { width: "100%", height: "100%" },
          }}
        />
      </div>
    </div>
  );
}