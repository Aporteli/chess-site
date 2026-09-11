import { useCallback, useEffect, useMemo, useState } from 'react';
import { Chess, type Square } from 'chess.js';
import type { Arrow } from 'react-chessboard';
import { handlePieceDrop } from '@/lib/tablebase/chess/play';
import { fenTurn } from '@/lib/tablebase/chess/moves';
import { useTablebaseStore } from '@/stores/tablebase-store';

// Helper ფუნქცია სტილების მისანიჭებლად (ჰუკის გარეთ)
function getSquareStyles(fromSq: string | null, legalTargets: Set<string>, hintUci: string | null) {
  const styles: Record<string, React.CSSProperties> = {};

  if (fromSq) {
    styles[fromSq] = { boxShadow: 'inset 0 0 0 3px var(--color-accent)' };
  }

  for (const sq of legalTargets) {
    styles[sq] = {
      background:
        'radial-gradient(circle, color-mix(in oklab, var(--color-fg) 35%, transparent) 22%, transparent 24%)',
    };
  }

  if (hintUci && hintUci.length >= 4) {
    styles[hintUci.slice(0, 2)] = { boxShadow: 'inset 0 0 0 3px var(--color-hint)' };
    styles[hintUci.slice(2, 4)] = { boxShadow: 'inset 0 0 0 3px var(--color-win)' };
  }

  return styles;
}

export function useChessBoardLogic() {
  const fen = useTablebaseStore((s) => s.fen);
  const flipped = useTablebaseStore((s) => s.flipped);
  const building = useTablebaseStore((s) => s.pipeline !== 'idle');
  const gameOver = useTablebaseStore((s) => s.gameOver);
  const hintUci = useTablebaseStore((s) => s.hintUci);

  const human = flipped ? 'b' : 'w';
  const [ready, setReady] = useState(false);
  const [fromSq, setFromSq] = useState<string | null>(null);

  useEffect(() => setReady(true), []);
  useEffect(() => setFromSq(null), [fen]);

  const legalTargets = useMemo(() => {
    if (!fromSq) return new Set<string>();
    try {
      const g = new Chess(fen);
      return new Set(g.moves({ square: fromSq as Square, verbose: true }).map((m) => m.to));
    } catch {
      return new Set<string>();
    }
  }, [fen, fromSq]);

  const handleSquareClick = useCallback(
    ({ square }: { square: string }) => {
      if (building || gameOver) return;

      if (fromSq && legalTargets.has(square)) {
        handlePieceDrop({ sourceSquare: fromSq, targetSquare: square });
        setFromSq(null);
        return;
      }

      try {
        const g = new Chess(fen);
        const piece = g.get(square as Square);
        if (piece && piece.color === human && g.turn() === human) {
          setFromSq(square);
        } else {
          setFromSq(null);
        }
      } catch {
        setFromSq(null);
      }
    },
    [building, gameOver, fromSq, legalTargets, fen, human]
  );

  const options = useMemo(() => {
    const turn = fenTurn(fen);
    const squareStyles = getSquareStyles(fromSq, legalTargets, hintUci);

    const arrows: Arrow[] =
      hintUci && hintUci.length >= 4
        ? [{ startSquare: hintUci.slice(0, 2), endSquare: hintUci.slice(2, 4), color: '#c5ccd4' }]
        : [];

    return {
      id: 'tablebase-board',
      position: fen,
      boardOrientation: (flipped ? 'black' : 'white') as 'white' | 'black',
      allowDragging: !building && !gameOver && turn === human,
      allowDrawingArrows: false,
      squareStyles,
      arrows,
      allowDragOffBoard: false,
      animationDurationInMs: 180,
      showAnimations: true,
      showNotation: true,
      lightSquareStyle: { backgroundColor: 'var(--color-board-light)' },
      darkSquareStyle: { backgroundColor: 'var(--color-board-dark)' },
      dropSquareStyle: { boxShadow: 'inset 0 0 0 3px var(--color-hint)' },
      boardStyle: { width: '100%', height: '100%', borderRadius: 0 },
      onPieceDrop: handlePieceDrop,
      onSquareClick: handleSquareClick,
    };
  }, [building, fen, flipped, fromSq, gameOver, hintUci, human, legalTargets, handleSquareClick]);

  return { ready, options };
}