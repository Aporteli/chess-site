'use client';

import { useMemo } from 'react';
import { Chessboard } from 'react-chessboard';
import { useSettingsStore } from '@/stores/settings-store';
import type { PlayerColor } from '@/lib/multiplayer/types';

interface MultiplayerBoardProps {
  fen: string;
  orientation: PlayerColor;
  interactive: boolean;
  onMove: (from: string, to: string) => boolean;
}

export function MultiplayerBoard({ fen, orientation, interactive, onMove }: MultiplayerBoardProps) {
  const animations = useSettingsStore((s) => s.animations);
  const coordinates = useSettingsStore((s) => s.coordinates);

  const options = useMemo(
    () => ({
      id: 'multiplayer-board',
      position: fen,
      boardOrientation: orientation,
      allowDragging: interactive,
      allowDrawingArrows: true,
      allowDragOffBoard: false,
      animationDurationInMs: animations ? 180 : 0,
      showAnimations: animations,
      showNotation: coordinates,
      lightSquareStyle: {
        backgroundColor: 'var(--color-board-light)',
        backgroundImage: 'linear-gradient(155deg, rgba(255,255,255,0.12), transparent 55%)',
      },
      darkSquareStyle: {
        backgroundColor: 'var(--color-board-dark)',
        backgroundImage: 'linear-gradient(155deg, rgba(255,255,255,0.06), transparent 55%)',
      },
      dropSquareStyle: { boxShadow: 'inset 0 0 0 3px var(--color-hint)' },
      darkSquareNotationStyle: { color: 'rgba(243, 230, 200, 0.82)', fontSize: '10px', fontWeight: 600 },
      lightSquareNotationStyle: { color: 'rgba(90, 61, 32, 0.72)', fontSize: '10px', fontWeight: 600 },
      boardStyle: { width: '100%', aspectRatio: '1 / 1', borderRadius: 0 },
      onPieceDrop: ({ sourceSquare, targetSquare }: { sourceSquare: string; targetSquare: string | null }) => {
        if (!targetSquare) return false;
        return onMove(sourceSquare, targetSquare);
      },
    }),
    [fen, orientation, interactive, animations, coordinates, onMove],
  );

  return (
    <div className="relative h-full w-full overflow-hidden rounded-md ring-1 ring-fg/15">
      <Chessboard options={options} />
    </div>
  );
}
