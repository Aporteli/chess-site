import { useCallback } from 'react';
import { usePuzzleStore } from '@/stores/puzzle-store';
import { useSettingsStore } from '@/stores/settings-store';

export function usePuzzleHandlers() {
  const makeMove = usePuzzleStore((s) => s.makeMove);
  const sound = useSettingsStore((s) => s.sound);

  const handlePieceDrop = useCallback(
    ({
      sourceSquare,
      targetSquare,
    }: {
      sourceSquare: string;
      targetSquare: string | null;
    }) => {
      if (!targetSquare) return false;
      return makeMove(sourceSquare, targetSquare, sound);
    },
    [makeMove, sound],
  );

  return { handlePieceDrop };
}