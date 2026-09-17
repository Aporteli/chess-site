import { useMemo } from 'react';
import type { Arrow } from 'react-chessboard';
import { useAnalysisStore } from './store/analysis-store';
import { useAnalysisBoardActions } from './use-analysis-board-actions';
import { useSettingsStore } from '@/stores/settings-store';

export function useChessBoardOptions() {
  const fen = useAnalysisStore((state) => state.fen);
  const arrows = useAnalysisStore((state) => state.arrows);
  const setArrows = useAnalysisStore((state) => state.setArrows);
  const hintUci = useAnalysisStore((state) => state.hintUci);
  const flipped = useSettingsStore((state) => state.flipped);
  const animations = useSettingsStore((state) => state.animations);
  const coordinates = useSettingsStore((state) => state.coordinates);
  const { handlePieceDrop } = useAnalysisBoardActions();

  return useMemo(
    () => {
      const hintArrows: Arrow[] =
        hintUci && hintUci.length >= 4
          ? [
              {
                startSquare: hintUci.slice(0, 2),
                endSquare: hintUci.slice(2, 4),
                color: '#c5ccd4',
              },
            ]
          : [];

      return {
        id: 'analysis-board',
        position: fen,
        boardOrientation: (flipped ? 'black' : 'white') as 'white' | 'black',
        allowDragging: true,
        allowDrawingArrows: true,
        allowDragOffBoard: false,
        arrows: hintArrows.length ? [...arrows, ...hintArrows] : arrows,
        onArrowsChange: ({ arrows: nextArrows }: { arrows: Arrow[] }) => setArrows(nextArrows),
        animationDurationInMs: animations ? 180 : 0,
        showAnimations: animations,
        showNotation: coordinates,
        lightSquareStyle: {
          backgroundColor: 'var(--color-board-light, #e8d9b5)',
          backgroundImage: 'linear-gradient(155deg, rgba(255,255,255,0.12), transparent 55%)',
        },
        darkSquareStyle: {
          backgroundColor: 'var(--color-board-dark, #7a4c2c)',
          backgroundImage: 'linear-gradient(155deg, rgba(255,255,255,0.06), transparent 55%)',
        },
        dropSquareStyle: {
          boxShadow: 'inset 0 0 0 3px rgba(201, 162, 86, 0.7)',
        },
        darkSquareNotationStyle: {
          color: 'rgba(243, 230, 200, 0.82)',
          fontSize: '10px',
          fontWeight: 600,
        },
        lightSquareNotationStyle: {
          color: 'rgba(90, 61, 32, 0.72)',
          fontSize: '10px',
          fontWeight: 600,
        },
        boardStyle: {
          width: '100%',
          aspectRatio: '1 / 1',
          borderRadius: 0,
        },
        onPieceDrop: handlePieceDrop,
      };
    },
    [fen, flipped, arrows, setArrows, handlePieceDrop, hintUci, animations, coordinates],
  );
}
