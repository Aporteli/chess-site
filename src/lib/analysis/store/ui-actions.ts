import type { StateCreator } from 'zustand';
import type { Arrow } from 'react-chessboard';

import type { AnalysisStore, UiActions } from './analysis-types';

export const createUiActions: StateCreator<AnalysisStore, [], [], UiActions> = (set) => ({
  toggleSound: () => {
    set((state) => ({
      sound: !state.sound,
    }));
  },

  toggleBoard: () => {
    set((state) => ({
      flipped: !state.flipped,
    }));
  },

  setArrows: (arrows: Arrow[]) => {
    set({
      arrows,
    });
  },

  openUploadModal: () => {
    set({
      isUploadBoardOpen: true,
    });
  },

  closeUploadModal: () => {
    set({
      isUploadBoardOpen: false,
    });
  },

  setSaveState: (saveState, saveMessage = '') => {
    set({
      saveState,
      saveMessage,
    });
  },
});