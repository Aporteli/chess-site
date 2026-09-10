'use client';

import { Chessboard } from 'react-chessboard';
import { useChessBoardLogic } from '@/hooks/tablebase/use-chess- board-logic';
import { BoardToolbar } from './BoardToolbar';
import { BoardActions } from './BoardActions';
import { GameOverOverlay } from './GameOverOverlay';

export function BoardColumn() {
  const { ready, options } = useChessBoardLogic();

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

        <BoardActions />
      </div>
      <GameOverOverlay />
    </div>
  );
}