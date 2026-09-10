'use client';

import { Chessboard } from 'react-chessboard';
import { BoardOverlay } from './BoardOverlay';
import { PromotionDialog } from './PromotionDialog';
import { EvalBar } from './EvalBar';
import { TrainerToolbar } from '@/components/board/TrainerToolbar';
import { useTrainer } from '@/lib/trainer/context';
import { useBoardStyles } from '@/hooks/board/use-board-styles';
import { useBoardOptions } from '@/hooks/board/use-board-options';

export function BoardWrapper() {
  const t = useTrainer();
  const turn = t.fen.split(' ')[1] === 'b' ? 'b' : 'w';
  const squareStyles = useBoardStyles(t);
  const options = useBoardOptions(t, squareStyles);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative mx-auto w-full max-w-[min(100%,620px)]">
        <TrainerToolbar />

        <div className="relative flex w-full items-stretch gap-2">
          <EvalBar flipped={t.flipped} />

          <div className="relative aspect-square min-w-0 flex-1 rounded-2xl p-3 wood-grain shadow-board sm:p-4">
            <span className="pointer-events-none absolute left-2 top-2 h-3 w-3 rounded-tl-md border-l-2 border-t-2 border-accent-gold/50" />
            <span className="pointer-events-none absolute right-2 top-2 h-3 w-3 rounded-tr-md border-r-2 border-t-2 border-accent-gold/50" />
            <span className="pointer-events-none absolute bottom-2 left-2 h-3 w-3 rounded-bl-md border-b-2 border-l-2 border-accent-gold/50" />
            <span className="pointer-events-none absolute bottom-2 right-2 h-3 w-3 rounded-br-md border-b-2 border-r-2 border-accent-gold/50" />

            <div className="relative h-full w-full overflow-hidden rounded-lg ring-1 ring-black/40">
              <Chessboard options={options} />
              {t.promotion && (
                <PromotionDialog color={turn} onPick={t.completePromotion} onCancel={t.cancelPromotion} />
              )}
            </div>
            <BoardOverlay status={t.moveStatus} />
          </div>
        </div>
      </div>
    </div>
  );
}
