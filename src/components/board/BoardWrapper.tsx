'use client';

import { useMemo } from 'react';
import { Chessboard } from 'react-chessboard';
import { BoardOverlay } from './BoardOverlay';
import { PromotionDialog } from './PromotionDialog';
import { EvalBar } from './EvalBar';
import { useTrainer } from '@/lib/trainer/context';
import { useTrainerStore, deriveActive } from '@/lib/trainer/store';
import { useBoardStyles } from '@/hooks/board/use-board-styles';
import { useBoardOptions } from '@/hooks/board/use-board-options';
import {
  useRegisterBoard,
  usePublishBoardFlags,
} from '@/hooks/board/use-register-board';
import type { BoardAdapter } from '@/lib/chess/board-adapter';
import { useSettingsStore } from '@/stores/settings-store';

export function BoardWrapper() {
  const t = useTrainer();
  const turn = t.fen.split(' ')[1] === 'b' ? 'b' : 'w';
  const settingsFlipped = useSettingsStore((s) => s.flipped);
  const flipped = t.flipped !== settingsFlipped;
  const squareStyles = useBoardStyles(t);
  const options = useBoardOptions(t, squareStyles);

  const adapter = useMemo<BoardAdapter>(
    () => ({
      getFen: () => deriveActive(useTrainerStore.getState()).fen,
      getHumanColor: () => {
        const side = deriveActive(useTrainerStore.getState()).repertoire?.side;
        return side === 'black' ? 'b' : 'w';
      },
      isBusy: () => false,
      isGameOver: () => {
        const s = useTrainerStore.getState();
        return Boolean(s.moveStatus && s.moveStatus !== 'pending');
      },
      getExistingHint: () => {
        const s = useTrainerStore.getState();
        if (s.mode !== 'drill' || !s.drill || s.drill.lineComplete) return null;
        return 'hint';
      },
      setHintUci: () => useTrainerStore.getState().requestHint(),
      getResetFen: () => deriveActive(useTrainerStore.getState()).fen,
      commitFen: () => {
        useTrainerStore.getState().restartLine();
        return true;
      },
      applyPlayedFen: () => {},
      soundEnabled: () => useSettingsStore.getState().sound,
    }),
    [],
  );

  useRegisterBoard({ boardId: 'trainer', adapter });

  usePublishBoardFlags({
    hintDisabled:
      t.mode !== 'drill' ||
      !t.drill ||
      Boolean(t.drill.lineComplete) ||
      Boolean(t.drill.sessionOver),
    resetDisabled: false,
  });

  return (
    <div className="flex flex-col items-center">
      <div className="relative mx-auto w-full max-w-[var(--board-size,52rem)]">
        <div className="relative flex w-full items-stretch gap-2">
          <EvalBar flipped={flipped} />

          <div className="relative aspect-square min-w-0 flex-1 rounded-2xl p-3 wood-grain shadow-board sm:p-4">
            <span className="pointer-events-none absolute left-2 top-2 h-3 w-3 rounded-tl-md border-l-2 border-t-2 border-accent-gold/50" />
            <span className="pointer-events-none absolute right-2 top-2 h-3 w-3 rounded-tr-md border-r-2 border-t-2 border-accent-gold/50" />
            <span className="pointer-events-none absolute bottom-2 left-2 h-3 w-3 rounded-bl-md border-b-2 border-l-2 border-accent-gold/50" />
            <span className="pointer-events-none absolute bottom-2 right-2 h-3 w-3 rounded-br-md border-b-2 border-r-2 border-accent-gold/50" />

            <div className="relative h-full w-full overflow-hidden rounded-lg ring-1 ring-black/40">
              <Chessboard options={options} />
              {t.promotion && (
                <PromotionDialog
                  color={turn}
                  onPick={t.completePromotion}
                  onCancel={t.cancelPromotion}
                />
              )}
            </div>

            <BoardOverlay status={t.moveStatus} />
          </div>
        </div>
      </div>
    </div>
  );
}