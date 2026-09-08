import { replaceRepertoire, type Repertoire, type Side } from '@/lib/chess';
import { deriveActive } from './deriveActive';
import type { BoardMarksActions, TrainerSlice } from './types';

export const createBoardMarksSlice: TrainerSlice<BoardMarksActions> = (set, get) => ({
  selectSquare: (square) => set({ selectedSquare: square }),

  toggleHighlight: (square) =>
    set((state) => {
      const next = { ...state.userHighlights };
      if (next[square]) delete next[square];
      else next[square] = 'rgba(201, 162, 86, 0.45)';
      return { userHighlights: next };
    }),

  clearMarks: () => set({ arrows: [], userHighlights: {}, selectedSquare: null }),

  flipBoard: () => {
    const { repertoire } = deriveActive(get());
    if (!repertoire) return;
    const nextSide: Side = repertoire.side === 'white' ? 'black' : 'white';
    set({ flipped: nextSide === 'black' });

    const nextRep: Repertoire = { ...repertoire, side: nextSide, updatedAt: Date.now() };
    set((state) => ({ store: { ...state.store, repertoires: replaceRepertoire(state.store.repertoires, nextRep) } }));

    if (get().mode === 'drill') {
      setTimeout(() => get().startPractice(), 50);
    }
  },

  restartLine: () => {
    if (get().mode === 'drill') get().startPractice();
    else get().goStart();
  },
});
