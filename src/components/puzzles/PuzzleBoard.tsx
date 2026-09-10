"use client";

import { useMemo } from "react";
import { Chessboard } from "react-chessboard";
import { usePuzzleStore } from "@/stores/puzzle-store";
import { usePuzzleHandlers } from "@/hooks/use-puzzle-handlers";
import { usePuzzleHint } from "@/hooks/puzzle/use-puzzle-hint";
import { BOARD_STYLE } from "./puzzle-board.constants";
import { PuzzleBoardEmpty } from "./PuzzleBoardEmpty";

export function PuzzleBoard() {
  const { puzzle, boardFen, flipped, hintLevel } = usePuzzleStore();
  const { handlePieceDrop } = usePuzzleHandlers();

  const { squareStyles, arrows } = usePuzzleHint({
    puzzle,
    boardFen,
    hintLevel,
  });

  const orientation = useMemo(() => {
    if (!puzzle) return "white";
    const playerSide = puzzle.fen.split(" ")[1] === "b" ? "black" : "white";
    return flipped ? (playerSide === "white" ? "black" : "white") : playerSide;
  }, [puzzle, flipped]);

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
        {boardFen ? <Chessboard options={boardOptions} /> : <PuzzleBoardEmpty />}
      </div>
    </div>
  );
}