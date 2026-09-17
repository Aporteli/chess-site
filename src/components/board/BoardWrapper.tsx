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
    <div className="board-stage">
      <EvalBar flipped={flipped} />

      <div className="wood-frame relative min-h-0 min-w-0 rounded-xl p-2 sm:rounded-2xl sm:p-2.5">
        <div className="relative h-full w-full overflow-hidden rounded-md ring-1 ring-fg/15">
          <Chessboard options={options} />
          {t.promotion && (
            <PromotionDialog
              color={turn}
              onPick={t.completePromotion}
              onCancel={t.cancelPromotion}
            />
          )}
          <BoardOverlay status={t.moveStatus} />
        </div>
      </div>
    </div>
  );
}