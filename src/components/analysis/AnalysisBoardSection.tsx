'use client';

import { useMemo, useRef } from 'react';
import { BoardWithEvaluation } from './BoardWithEvaluation';
import { BoardNavigation } from './BoardNavigation';
import {
  useRegisterBoard,
  usePublishBoardFlags,
} from '@/hooks/board/use-register-board';
import type { BoardAdapter } from '@/lib/chess/board-adapter';
import { useAnalysisStore } from '@/lib/analysis/store/analysis-store';
import { useAnalysisActions } from '@/lib/analysis/use-analysis-actions';
import { useSettingsStore } from '@/stores/settings-store';

/**
 * Loose view of the analysis store. Only the fields the adapter needs
 * are declared. Anything the store doesn't provide is treated as
 * "unsupported" and simply disables the matching navbar action rather
 * than crashing — that's why everything is optional except `fen`.
 */
interface AnalysisStoreShape {
  fen: string;
  startFen?: string | null;
  loading?: boolean;
  gameOver?: unknown;
  engineLines?: { uci?: string }[];
  setHint?: (uci: string | null) => void;
  setFen?: (fen: string) => void;
  openUploadModal?: () => void;
  setUploadOpen?: (open: boolean) => void;
}

const readStore = () =>
  useAnalysisStore.getState() as unknown as AnalysisStoreShape;

export function AnalysisBoardSection() {
  const actions = useAnalysisActions();

  // Keep actions fresh inside the adapter without forcing the memo to
  // depend on a potentially unstable identity.
  const actionsRef = useRef(actions);
  actionsRef.current = actions;

  /**
   * Resolve whichever "open the upload modal" entry point actually
   * exists on `useAnalysisActions` (or the store). Returns `undefined`
   * when none is available, which hides the camera button in the menu.
   */
  const openUpload = useMemo<(() => void) | undefined>(() => {
    const loose = actions as unknown as {
      openUploadModal?: () => void;
      openUpload?: () => void;
      setUploadOpen?: (open: boolean) => void;
      setUploadBoardOpen?: (open: boolean) => void;
    };

    if (typeof loose.openUploadModal === 'function') return loose.openUploadModal;
    if (typeof loose.openUpload === 'function') return loose.openUpload;
    if (typeof loose.setUploadOpen === 'function') {
      const set = loose.setUploadOpen;
      return () => set(true);
    }
    if (typeof loose.setUploadBoardOpen === 'function') {
      const set = loose.setUploadBoardOpen;
      return () => set(true);
    }

    const st = readStore();
    if (typeof st.openUploadModal === 'function') return st.openUploadModal;
    if (typeof st.setUploadOpen === 'function') {
      const set = st.setUploadOpen;
      return () => set(true);
    }
    return undefined;
  }, [actions]);

  const adapter = useMemo<BoardAdapter>(
    () => ({
      getFen: () => readStore().fen,
      getHumanColor: () => {
        const fen = readStore().fen;
        return fen.split(' ')[1] === 'b' ? 'b' : 'w';
      },
      isBusy: () => Boolean(readStore().loading),
      isGameOver: () => Boolean(readStore().gameOver),
      getExistingHint: () => readStore().engineLines?.[0]?.uci ?? null,
      setHintUci: (uci) => useAnalysisStore.getState().setHint(uci),
      getResetFen: () => {
        const st = readStore();
        return st.startFen ?? st.fen;
      },
      commitFen: (f) => {
        actionsRef.current.loadPosition(f);
        return true;
      },
      applyPlayedFen: (f) => readStore().setFen?.(f),
      soundEnabled: () => useSettingsStore.getState().sound,
    }),
    [],
  );

  useRegisterBoard({
    boardId: 'analysis',
    adapter,
    supportsUpload: Boolean(openUpload),
    openUpload,
  });

  const fen = useAnalysisStore((s) => s.fen);
  const loading = useAnalysisStore(
    (s) => (s as unknown as { loading?: boolean }).loading ?? false,
  );

  usePublishBoardFlags({
    hintDisabled: !fen || loading,
    resetDisabled: !fen || loading,
  });

  return (
    <section className="board-column justify-center gap-2 sm:gap-3">
      <div className="mx-auto flex w-full max-w-[var(--board-size,52rem)] items-stretch gap-2 sm:gap-3">
        <BoardWithEvaluation />
      </div>
      <BoardNavigation />
    </section>
  );
}