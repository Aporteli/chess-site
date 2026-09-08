import { loadSettings, replaceChapter, replaceRepertoire } from '@/lib/chess';
import { createEmptyDrill } from '../createEmptyDrill';
import { deriveActive } from './deriveActive';
import type { CoreActions, TrainerRawState, TrainerSlice } from './types';

export const initialCoreState: TrainerRawState = {
  ready: false,
  store: { version: 1, repertoires: [] },
  repId: '',
  chapterId: '',
  path: [],
  mode: 'study',
  flipped: false,
  selectedSquare: null,
  moveStatus: 'pending',
  arrows: [],
  userHighlights: {},
  promotion: null,
  premove: null,
  settings: loadSettings(),
  drill: null,
  filter: 'due',
};

export const createCoreSlice: TrainerSlice<CoreActions> = (set, get) => ({
  setStore: (updater) =>
    set((state) => ({ store: typeof updater === 'function' ? updater(state.store) : updater })),
  setRepId: (id) => set({ repId: id }),
  setChapterId: (id) => set({ chapterId: id }),
  setPath: (path) => set({ path }),
  setFlipped: (v) => set({ flipped: v }),
  setSelectedSquare: (square) => set({ selectedSquare: square }),
  setModeRaw: (mode) => set({ mode }),
  setArrows: (arrows) => set({ arrows }),
  setUserHighlights: (updater) =>
    set((state) => ({
      userHighlights: typeof updater === 'function' ? updater(state.userHighlights) : updater,
    })),
  setPromotion: (p) => set({ promotion: p }),
  setPremove: (p) => set({ premove: p }),
  setDrill: (updater) =>
    set((state) => ({ drill: typeof updater === 'function' ? updater(state.drill) : updater })),
  setFilter: (filter) => set({ filter }),

  updateChapter: (next, nextPath) => {
    const { repertoire } = deriveActive(get());
    set((state) => {
      const rep = state.store.repertoires.find((r) => r.id === (repertoire?.id ?? ''));
      if (!rep) return state;
      return {
        store: {
          ...state.store,
          repertoires: replaceRepertoire(state.store.repertoires, replaceChapter(rep, next)),
        },
      };
    });
    if (nextPath) set({ path: nextPath });
  },
});
