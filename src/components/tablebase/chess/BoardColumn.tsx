'use client';

import { useEffect, useRef, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { useChessBoardLogic } from '@/hooks/tablebase/use-chess-board-logic';
import { BoardToolbar } from './BoardToolbar';
import { BoardActions } from './BoardActions';
import { GameOverOverlay } from './GameOverOverlay';
import { EvalBar } from '@/components/board/EvalBar';
import { StockfishProvider } from '@/components/stockfish/StockfishContext';
import { useTablebaseStore } from '@/stores/tablebase-store';

// Keeps the board a perfect square on every screen size and orientation.
const EVALBAR_WIDTH = 14; // w-3.5 (0.875rem)
const EVALBAR_GAP = 8; // gap-2 (0.5rem)
const LG_MIN_WIDTH = 1024; // Tailwind's `lg` breakpoint (two-column layout)

export function BoardColumn() {
  const { ready, options } = useChessBoardLogic();
  const fen = useTablebaseStore((s) => s.fen);

  const areaRef = useRef<HTMLDivElement>(null);
  const [boardSize, setBoardSize] = useState(0);

  useEffect(() => {
    const area = areaRef.current;
    if (!area) return;

    let lastWidth = 0;
    let rafId = 0;

    const measure = () => {
      const rect = area.getBoundingClientRect();
      lastWidth = rect.width;
      const availableWidth = Math.max(0, rect.width - EVALBAR_WIDTH - EVALBAR_GAP);
      const twoColumn =
        window.matchMedia(`(min-width: ${LG_MIN_WIDTH}px)`).matches ||
        window.matchMedia('(orientation: landscape)').matches;

      // Two-column (landscape phones/tablets and lg+): the column has a fixed
      // height, so fit the smaller of width/height. Single-column (portrait):
      // the page scrolls, so the board is a stable full-width square.
      const size = twoColumn
        ? Math.max(0, Math.floor(Math.min(availableWidth, rect.height)))
        : Math.max(0, Math.floor(availableWidth));

      setBoardSize(size);
    };

    const schedule = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(measure);
    };

    measure();

    // Only react to WIDTH changes. Height changes are caused by our own board
    // render (the area is content-sized in portrait) and re-measuring on them
    // creates a resize feedback loop that looks like flickering.
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (Math.abs(entry.contentRect.width - lastWidth) > 0.5) {
          schedule();
          break;
        }
      }
    });
    observer.observe(area);

    window.addEventListener('orientationchange', schedule);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('orientationchange', schedule);
    };
  }, []);

  return (
    <StockfishProvider fen={fen}>
      <div className="flex h-full min-h-0 w-full flex-col items-center justify-between landscape:col-span-7 lg:col-span-7">
        <BoardToolbar />

        <div
          ref={areaRef}
          className="relative flex w-full flex-1 min-h-0 items-center justify-center overflow-hidden"
        >
          {boardSize > 0 && (
            <div className="flex items-stretch justify-center gap-2" style={{ height: boardSize }}>
              <EvalBar flipped={false} />
              <div
                className="wood-frame relative rounded-xl p-2 sm:rounded-2xl sm:p-2.5"
                style={{ width: boardSize, height: boardSize }}
              >
                <div className="relative h-full w-full overflow-hidden rounded-md ring-1 ring-fg/15">
                  {ready ? (
                    <Chessboard options={options} />
                  ) : (
                    <div className="h-full w-full bg-elevated" />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <BoardActions />
        <GameOverOverlay />
      </div>
    </StockfishProvider>
  );
}