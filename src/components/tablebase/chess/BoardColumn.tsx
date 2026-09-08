'use client';

import { useEffect, useMemo, useState } from 'react';
import { Chess, type Square } from 'chess.js';
import { Chessboard, type Arrow } from 'react-chessboard';
import { handlePieceDrop } from '@/lib/tablebase/chess/play';
import { fenTurn } from '@/lib/tablebase/chess/moves';
import { useTablebaseStore } from '@/stores/tablebase-store';
import { BoardToolbar } from './BoardToolbar';
import { GameOverOverlay } from './GameOverOverlay';

export function BoardColumn() {
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

  //* ლეგალური სამიზნე უჯრების გამოთვლა

  const legalTargets = useMemo(() => {
    if (!fromSq) return new Set<string>();
    try {
      const g = new Chess(fen);
      return new Set(g.moves({ square: fromSq as Square, verbose: true }).map((m) => m.to));
    } catch {
      return new Set<string>();
    }
  }, [fen, fromSq]);

  //* ჭადრაკის დაფის ინტერაქციების, სტილებისა და სვლების ვიზუალიზაციის ოპტიმიზებული კონფიგურაცია useMemo-ს გამოყენებით.

  const options = useMemo(() => {
    const turn = fenTurn(fen);
    const squareStyles: Record<string, React.CSSProperties> = {};
    if (fromSq) {
      squareStyles[fromSq] = { boxShadow: 'inset 0 0 0 3px var(--color-accent)' };
    }
    for (const sq of legalTargets) {
      squareStyles[sq] = {
        background:
          'radial-gradient(circle, color-mix(in oklab, var(--color-fg) 35%, transparent) 22%, transparent 24%)',
      };
    }
    if (hintUci && hintUci.length >= 4) {
      squareStyles[hintUci.slice(0, 2)] = {
        boxShadow: 'inset 0 0 0 3px var(--color-hint)',
      };
      squareStyles[hintUci.slice(2, 4)] = {
        boxShadow: 'inset 0 0 0 3px var(--color-win)',
      };
    }
    const arrows: Arrow[] =
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
      onSquareClick: ({ square }: { square: string }) => {
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
          } else setFromSq(null);
        } catch {
          setFromSq(null);
        }
      },
    };
  }, [building, fen, flipped, fromSq, gameOver, hintUci, human, legalTargets]);

  return (
    <div className="flex min-h-0 min-w-0 w-full flex-col items-center xl:col-span-7 xl:h-full">
      <div className="flex min-h-0 w-full max-w-[min(100%,calc(100dvh-10rem))] flex-1 flex-col xl:max-w-none">
        <BoardToolbar />
        <div className="relative mx-auto aspect-square w-full max-w-[min(100%,calc(100dvh-11rem))]">
          <div className="wood-frame h-full w-full rounded-xl p-2 sm:rounded-2xl sm:p-2.5">
            <div className="relative h-full w-full overflow-hidden rounded-md ring-1 ring-fg/15">
              {ready ? <Chessboard options={options} /> : <div className="h-full w-full bg-elevated" />}
            </div>
          </div>
        </div>

        {/* სტანდარტული Flex კონტეინერი absolute-ის გარეშე */}
        <div className="mt-3 flex items-center justify-center gap-2 w-full">
          <button
            type="button"
            className="rounded-md bg-bg-elevated py-1 px-3 text-[13px] font-medium text-text-secondary border border-border-default shadow hover:bg-bg-surface hover:text-accent-gold-bright transition-colors"
            aria-label="Undo move"
            disabled>
            Undo
          </button>
          <button
            type="button"
            className="rounded-md bg-bg-elevated py-1 px-3 text-[13px] font-medium text-text-secondary border border-border-default shadow hover:bg-bg-surface hover:text-accent-teal-bright transition-colors"
            aria-label="Redo move"
            disabled>
            Redo
          </button>
        </div>
      </div>
      <GameOverOverlay />
    </div>
  );
}