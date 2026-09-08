import { useCallback } from "react";
import { usePuzzleStore } from "@/stores/puzzle-store";

export function usePuzzleHandlers() {
  const { sound, makeMove } = usePuzzleStore();

  const handlePieceDrop = useCallback(
    ({ sourceSquare, targetSquare }: { sourceSquare: string; targetSquare: string | null }) => {
      if (!targetSquare) return false;
      return makeMove(sourceSquare, targetSquare, sound);
    },
    [makeMove, sound]
  );

  return { handlePieceDrop };
}