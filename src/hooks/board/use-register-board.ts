import { useEffect } from 'react';
import type { BoardAdapter } from '@/lib/chess/board-adapter';
import { useActiveBoardStore } from '@/stores/active-board-store';

interface RegisterOptions {
  boardId: string;
  adapter: BoardAdapter;
  supportsUpload?: boolean;
  openUpload?: () => void;
}

export function useRegisterBoard(reg: RegisterOptions) {
  const setActive = useActiveBoardStore((s) => s.setActive);
  const clear = useActiveBoardStore((s) => s.clear);

  useEffect(() => {
    setActive({
      boardId: reg.boardId,
      adapter: reg.adapter,
      supportsUpload: reg.supportsUpload ?? false,
      openUpload: reg.openUpload,
    });
    return () => clear(reg.boardId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reg.boardId, setActive, clear]);
}

export function usePublishBoardFlags(flags: {
  hintDisabled: boolean;
  resetDisabled: boolean;
}) {
  const setFlags = useActiveBoardStore((s) => s.setFlags);

  useEffect(() => {
    setFlags({
      hintDisabled: flags.hintDisabled,
      resetDisabled: flags.resetDisabled,
    });
  }, [flags.hintDisabled, flags.resetDisabled, setFlags]);
}