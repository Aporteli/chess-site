import { useMemo } from "react";
import type { Arrow } from "react-chessboard";
import { lineIndex } from "@/lib/utils";
import type { Puzzle } from "@/lib/types";

interface UsePuzzleHintProps {
  puzzle: Puzzle | null;
  boardFen: string | null;
  hintLevel: number;
}

export function usePuzzleHint({ puzzle, boardFen, hintLevel }: UsePuzzleHintProps) {
  const hintUci = useMemo(() => {
    if (!puzzle || !boardFen) return undefined;
    const idx = lineIndex(puzzle.fen, boardFen, puzzle.solution);
    return idx >= 0 ? puzzle.solution[idx] : undefined;
  }, [puzzle, boardFen]);

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

  const arrows: Arrow[] = useMemo(() => {
    return hintLevel >= 2 && hintFrom && hintTo
      ? [{ startSquare: hintFrom, endSquare: hintTo, color: "#e8c579" }]
      : [];
  }, [hintLevel, hintFrom, hintTo]);

  return { squareStyles, arrows };
}