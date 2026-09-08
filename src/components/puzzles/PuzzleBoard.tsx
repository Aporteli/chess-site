"use client";

import { useMemo } from "react";
import { Chessboard, type Arrow } from "react-chessboard";
import { usePuzzleStore } from "@/stores/puzzle-store";
import { usePuzzleHandlers } from "@/hooks/use-puzzle-handlers";
import { PuzzleIcon } from "lucide-react";

const BOARD_STYLE = {
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
  dropSquareStyle: { boxShadow: "inset 0 0 0 3px rgba(201, 162, 86, 0.7)" },
  darkSquareNotationStyle: {
    color: "rgba(243, 230, 200, 0.82)",
    fontSize: "10px",
    fontWeight: 600,
  },
  lightSquareNotationStyle: {
    color: "rgba(90, 61, 32, 0.72)",
    fontSize: "10px",
    fontWeight: 600,
  },
  boardStyle: { width: "100%", height: "100%", borderRadius: 0 },
};

export function PuzzleBoard() {
  const { puzzle, boardFen, flipped, hintLevel } = usePuzzleStore();
  const { handlePieceDrop } = usePuzzleHandlers();

  const playerSide = puzzle?.fen.split(" ")[1] === "b" ? "black" : "white";
  const orientation = flipped
    ? playerSide === "white"
      ? "black"
      : "white"
    : playerSide;

  // Compute hint arrows
  const hintIdx = puzzle && boardFen
    ? (() => {
        // Use lineIndex from utils; we'll import it
        const { lineIndex } = require("@/lib/utils");
        return lineIndex(puzzle.fen, boardFen, puzzle.solution);
      })()
    : -1;
  const hintUci = puzzle && hintIdx >= 0 ? puzzle.solution[hintIdx] : undefined;
  const hintFrom = hintUci?.slice(0, 2);
  const hintTo = hintUci?.slice(2, 4);

  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};
    if (hintLevel >= 1 && hintFrom) {
      styles[hintFrom] = {
        boxShadow: "inset 0 0 0 3px rgba(232, 197, 121, 0.95)",
      };
    }
    if (hintLevel >= 2 && hintTo) {
      styles[hintTo] = {
        boxShadow: "inset 0 0 0 3px rgba(127, 192, 175, 0.95)",
      };
    }
    return styles;
  }, [hintFrom, hintLevel, hintTo]);

  const arrows: Arrow[] =
    hintLevel >= 2 && hintFrom && hintTo
      ? [{ startSquare: hintFrom, endSquare: hintTo, color: "#e8c579" }]
      : [];

  const boardOptions = useMemo(
    () => ({
      id: "puzzle-board",
      position: boardFen ?? undefined,
      boardOrientation: orientation as "white" | "black",
      allowDragging: Boolean(puzzle),
      allowDrawingArrows: false,
      allowDragOffBoard: false,
      animationDurationInMs: 180,
      showAnimations: true,
      showNotation: true,
      squareStyles,
      arrows,
      ...BOARD_STYLE,
      onPieceDrop: handlePieceDrop,
    }),
    [boardFen, handlePieceDrop, orientation, puzzle, squareStyles, arrows]
  );

  return (
    <div className="relative h-full w-full rounded-2xl p-2.5 wood-grain shadow-board sm:p-3">
      <span className="pointer-events-none absolute left-2 top-2 h-3 w-3 rounded-tl-md border-l-2 border-t-2 border-accent-gold/50" />
      <span className="pointer-events-none absolute right-2 top-2 h-3 w-3 rounded-tr-md border-r-2 border-t-2 border-accent-gold/50" />
      <span className="pointer-events-none absolute bottom-2 left-2 h-3 w-3 rounded-bl-md border-b-2 border-l-2 border-accent-gold/50" />
      <span className="pointer-events-none absolute bottom-2 right-2 h-3 w-3 rounded-br-md border-r-2 border-b-2 border-accent-gold/50" />
      <div className="relative h-full w-full overflow-hidden rounded-lg ring-1 ring-black/40">
        {boardFen ? (
          <Chessboard options={boardOptions} />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-bg-elevated px-6 text-center">
            <PuzzleIcon className="h-10 w-10 text-accent-gold/50" />
            <p className="font-serif text-lg text-text-secondary">
              No puzzle yet
            </p>
            <p className="max-w-xs font-mono text-xs text-text-muted">
              Generate a tactic from a FEN or leave it blank for a random
              position.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}