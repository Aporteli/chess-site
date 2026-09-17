'use client';

import { Chessboard } from 'react-chessboard';
import { useChessBoardLogic } from '@/hooks/tablebase/use-chess-board-logic';
import { BoardToolbar } from './BoardToolbar';
import { BoardActions } from './BoardActions';
import { GameOverOverlay } from './GameOverOverlay';
import { EvalBar } from '@/components/board/EvalBar';
import { StockfishProvider } from '@/components/stockfish/StockfishContext';
import { useTablebaseStore } from '@/stores/tablebase-store';

export function BoardColumn() {
  const { ready, options } = useChessBoardLogic();
  const fen = useTablebaseStore((s) => s.fen);

  return (
    <StockfishProvider fen={fen}>
      <div className="board-column justify-center">
        <BoardToolbar />

        <div className="mx-auto flex w-full max-w-[var(--board-size,52rem)] items-stretch gap-2">
          <EvalBar flipped={false} />

          <div className="wood-frame relative aspect-square min-w-0 flex-1 rounded-xl p-2 sm:rounded-2xl sm:p-2.5">
            <div className="relative h-full w-full overflow-hidden rounded-md ring-1 ring-fg/15">
              {ready ? <Chessboard options={options} /> : <div className="h-full w-full bg-elevated" />}
            </div>
          </div>
        </div>

        <BoardActions />
        <GameOverOverlay />
      </div>
    </StockfishProvider>
  );
}
