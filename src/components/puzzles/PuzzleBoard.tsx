'use client';

import { useMemo } from 'react';
import { Chessboard } from 'react-chessboard';
import { usePuzzleStore } from '@/stores/puzzle-store';
import { usePuzzleHandlers } from '@/hooks/use-puzzle-handlers';
import { usePuzzleHint } from '@/hooks/puzzle/use-puzzle-hint';
import {
  useRegisterBoard,
  usePublishBoardFlags,
} from '@/hooks/board/use-register-board';
import type { BoardAdapter } from '@/lib/chess/board-adapter';
import { useSettingsStore } from '@/stores/settings-store';
import { lineIndex } from '@/lib/utils';
import { fenTurn } from '@/lib/tablebase/chess/moves';

export function PuzzleBoard() {
  const puzzle = usePuzzleStore((s) => s.puzzle);
  const boardFen = usePuzzleStore((s) => s.boardFen);
  const status = usePuzzleStore((s) => s.status);
  const hintLevel = usePuzzleStore((s) => s.hintLevel);
  const loading = usePuzzleStore((s) => s.loading);
  const setBoardFen = usePuzzleStore((s) => s.setBoardFen);

  const flipped = useSettingsStore((s) => s.flipped);
  const animations = useSettingsStore((s) => s.animations);
  const coordinates = useSettingsStore((s) => s.coordinates);

  const { handlePieceDrop } = usePuzzleHandlers();

  const { squareStyles: hintStyles, arrows: hintArrows } = usePuzzleHint({
    puzzle,
    boardFen,
    hintLevel,
  });

  // -------- Registration --------
  const adapter = useMemo<BoardAdapter>(
    () => ({
      getFen: () => usePuzzleStore.getState().boardFen ?? '',
      getHumanColor: () => {
        const p = usePuzzleStore.getState().puzzle;
        return p ? fenTurn(p.fen) : 'w';
      },
      isBusy: () => usePuzzleStore.getState().loading,
      isGameOver: () => usePuzzleStore.getState().status === 'Solved',
      getExistingHint: () => {
        const { puzzle, boardFen } = usePuzzleStore.getState();
        if (!puzzle || !boardFen) return null;
        const idx = lineIndex(puzzle.fen, boardFen, puzzle.solution);
        const uci = idx >= 0 ? puzzle.solution[idx] : puzzle.solution[0];
        return uci && uci.length >= 4 ? uci : null;
      },
      setHintUci: () => {
        const { hintLevel, setHintLevel } = usePuzzleStore.getState();
        setHintLevel(hintLevel + 1);
      },
      getResetFen: () => usePuzzleStore.getState().puzzle?.fen ?? '',
      commitFen: () => {
        usePuzzleStore.getState().resetPuzzle();
        return true;
      },
      applyPlayedFen: (f) => setBoardFen(f),
      soundEnabled: () => useSettingsStore.getState().sound,
    }),
    [setBoardFen],
  );

  useRegisterBoard({ boardId: 'puzzle', adapter });

  usePublishBoardFlags({
    hintDisabled: !puzzle || hintLevel >= 2 || status === 'Solved',
    resetDisabled: !puzzle || loading,
  });

  // -------- Render --------
  const turn = boardFen ? fenTurn(boardFen) : 'w';
  const human = puzzle ? fenTurn(puzzle.fen) : 'w';
  const canDrag = Boolean(boardFen) && !loading && status !== 'Solved' && turn === human;

  const options = useMemo(
    () => ({
      id: 'puzzle-board',
      position: boardFen ?? '8/8/8/8/8/8/8/8 w - - 0 1',
      boardOrientation: (flipped ? 'black' : 'white') as 'white' | 'black',
      allowDragging: canDrag,
      allowDrawingArrows: false,
      animationDurationInMs: animations ? 180 : 0,
      showAnimations: animations,
      showNotation: coordinates,
      lightSquareStyle: { backgroundColor: 'var(--color-board-light)' },
      darkSquareStyle: { backgroundColor: 'var(--color-board-dark)' },
      dropSquareStyle: { boxShadow: 'inset 0 0 0 3px var(--color-hint)' },
      boardStyle: { width: '100%', height: '100%', borderRadius: 0 },
      squareStyles: hintStyles,
      arrows: hintArrows,
      onPieceDrop: handlePieceDrop,
    }),
    [boardFen, flipped, canDrag, hintStyles, hintArrows, handlePieceDrop, animations, coordinates],
  );

  return (
    <div className="relative aspect-square w-full">
      {boardFen ? (
        <Chessboard options={options} />
      ) : (
        <div className="grid h-full w-full place-items-center rounded-lg bg-elevated text-sm text-muted">
          Generate a puzzle to begin
        </div>
      )}
      {status === 'Solved' && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="rounded-full border border-accent-gold/40 bg-accent-gold-dim/90 px-4 py-2 text-sm font-semibold text-accent-gold-bright backdrop-blur">
            Solved!
          </div>
        </div>
      )}
    </div>
  );
}