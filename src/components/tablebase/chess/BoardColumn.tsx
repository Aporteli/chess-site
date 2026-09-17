'use client';

import { useMemo } from 'react';
import { Chessboard } from 'react-chessboard';
import { useChessBoardLogic } from '@/hooks/tablebase/use-chess-board-logic';
import {
  useRegisterBoard,
  usePublishBoardFlags,
} from '@/hooks/board/use-register-board';
import { armEngineReply } from '@/lib/tablebase/chess/engine-reply';
import { fenTurn } from '@/lib/tablebase/chess/moves';
import type { BoardAdapter } from '@/lib/chess/board-adapter';
import { useSettingsStore } from '@/stores/settings-store';
import { useTablebaseStore } from '@/stores/tablebase-store';
import { BoardToolbar } from './BoardToolbar';
import { BoardActions } from './BoardActions';
import { GameOverOverlay } from './GameOverOverlay';
import { EvalBar } from '@/components/board/EvalBar';
import { StockfishProvider } from '@/components/stockfish/StockfishContext';

export function BoardColumn() {
  const { ready, options } = useChessBoardLogic();
  const fen = useTablebaseStore((s) => s.fen);

  const adapter = useMemo<BoardAdapter>(() => {
    const store = () => useTablebaseStore.getState();
    const settings = () => useSettingsStore.getState();
    return {
      getFen: () => store().fen,
      getHumanColor: () => (settings().flipped ? 'b' : 'w'),
      isBusy: () => store().pipeline !== 'idle',
      isGameOver: () => Boolean(store().gameOver),
      getExistingHint: () =>
        store().result?.moves?.[0]?.uci ?? store().localLines[0]?.uci ?? null,
      setHintUci: (uci) => store().setHintUci(uci),
      getResetFen: () =>
        store().activeCard?.fen ??
        store().catalog[store().endgameIndex]?.fen ??
        store().fen,
      commitFen: (f) => store().commitFen(f),
      applyPlayedFen: (f, uci) => store().applyPlayedFen(f, uci),
      setGameOver: (reason) => useTablebaseStore.setState({ gameOver: reason }),
      armEngineReply: (f) => armEngineReply(f),
      soundEnabled: () => settings().sound,
    };
  }, []);

  useRegisterBoard({
    boardId: 'tablebase',
    adapter,
    supportsUpload: true,
    openUpload: () => useTablebaseStore.getState().setUploadOpen(true),
  });

  const building = useTablebaseStore((s) => s.pipeline !== 'idle');
  const gameOver = useTablebaseStore((s) => s.gameOver);
  const flipped = useSettingsStore((s) => s.flipped);
  const human = flipped ? 'b' : 'w';
  const turn = fenTurn(fen);

  usePublishBoardFlags({
    hintDisabled: building || Boolean(gameOver) || turn !== human,
    resetDisabled: building,
  });

  return (
    <StockfishProvider fen={fen}>
      <div className="board-column justify-center">
        <BoardToolbar />

        <div className="mx-auto flex w-full max-w-[var(--board-size,52rem)] items-stretch gap-2">
          <EvalBar flipped={flipped} />

          <div className="wood-frame relative aspect-square min-w-0 flex-1 rounded-xl p-2 sm:rounded-2xl sm:p-2.5">
            <div className="relative h-full w-full overflow-hidden rounded-md ring-1 ring-fg/15">
              {ready ? (
                <Chessboard options={options} />
              ) : (
                <div className="h-full w-full bg-elevated" />
              )}
            </div>
          </div>
        </div>

        <BoardActions />
        <GameOverOverlay />
      </div>
    </StockfishProvider>
  );
}