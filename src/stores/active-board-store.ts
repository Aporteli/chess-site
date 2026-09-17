import { create } from 'zustand';
import type { BoardAdapter } from '@/lib/chess/board-adapter';

interface ActiveBoardState {
  boardId: string | null;
  adapter: BoardAdapter | null;
  supportsUpload: boolean;
  openUpload: (() => void) | null;
  hintDisabled: boolean;
  resetDisabled: boolean;

  setActive: (reg: {
    boardId: string;
    adapter: BoardAdapter;
    supportsUpload: boolean;
    openUpload?: () => void;
  }) => void;

  setFlags: (flags: { hintDisabled: boolean; resetDisabled: boolean }) => void;

  clear: (boardId: string) => void;
}

export const useActiveBoardStore = create<ActiveBoardState>((set, get) => ({
  boardId: null,
  adapter: null,
  supportsUpload: false,
  openUpload: null,
  hintDisabled: true,
  resetDisabled: true,

  setActive: (reg) =>
    set({
      boardId: reg.boardId,
      adapter: reg.adapter,
      supportsUpload: reg.supportsUpload,
      openUpload: reg.openUpload ?? null,
    }),

  setFlags: ({ hintDisabled, resetDisabled }) =>
    set({ hintDisabled, resetDisabled }),

  clear: (boardId) => {
    if (get().boardId !== boardId) return;
    set({
      boardId: null,
      adapter: null,
      supportsUpload: false,
      openUpload: null,
      hintDisabled: true,
      resetDisabled: true,
    });
  },
}));