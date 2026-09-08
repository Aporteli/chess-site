import {
  chessFromFen,
  emptyChapter,
  fenTurn,
  replaceRepertoire,
  resetStore,
  saveSession,
  uid,
  type Repertoire,
} from '@/lib/chess';
import { deriveActive } from './deriveActive';
import type { LibraryActions, TrainerSlice } from './types';

export const createLibrarySlice: TrainerSlice<LibraryActions> = (set, get) => ({
  createChapter: (name) => {
    const { repertoire } = deriveActive(get());
    if (!repertoire) return;
    const ch = emptyChapter(name);
    const next: Repertoire = { ...repertoire, chapters: [...repertoire.chapters, ch], updatedAt: Date.now() };
    set((state) => ({ store: { ...state.store, repertoires: replaceRepertoire(state.store.repertoires, next) } }));
    set({ chapterId: ch.id, path: [ch.rootId] });
  },

  createRepertoire: (name, side) => {
    const ch = emptyChapter('Main line');
    const rep: Repertoire = {
      id: uid('rep'),
      name,
      side,
      description: '',
      chapters: [ch],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    set((state) => ({ store: { ...state.store, repertoires: [...state.store.repertoires, rep] } }));
    set({ repId: rep.id, chapterId: ch.id, path: [ch.rootId], flipped: side === 'black' });
  },

  deleteChapter: (id) => {
    const { repertoire } = deriveActive(get());
    if (!repertoire || repertoire.chapters.length <= 1) return;
    const nextChapters = repertoire.chapters.filter((c) => c.id !== id);
    const next: Repertoire = { ...repertoire, chapters: nextChapters, updatedAt: Date.now() };
    set((state) => ({ store: { ...state.store, repertoires: replaceRepertoire(state.store.repertoires, next) } }));
    if (get().chapterId === id) {
      set({ chapterId: nextChapters[0]!.id, path: [nextChapters[0]!.rootId] });
    }
  },

  deleteRepertoire: (id) => {
    const { store, repId } = get();
    if (store.repertoires.length <= 1) return;
    const next = store.repertoires.filter((r) => r.id !== id);
    set({ store: { ...store, repertoires: next } });
    if (repId === id) {
      set({ repId: next[0]!.id, chapterId: next[0]!.chapters[0]!.id, path: [next[0]!.chapters[0]!.rootId] });
    }
  },

  resetToSeed: () => {
    const fresh = resetStore();
    set({
      store: fresh,
      repId: fresh.repertoires[0]!.id,
      chapterId: fresh.repertoires[0]!.chapters[0]!.id,
      path: [fresh.repertoires[0]!.chapters[0]!.rootId],
      mode: 'study',
      drill: null,
    });
  },

  loadCustomFen: (customFen, name = 'Book Position') => {
    const { repertoire } = deriveActive(get());
    if (!repertoire) return false;
    let startFen: string;
    try {
      startFen = chessFromFen(customFen).fen();
    } catch {
      return false;
    }

    const ch = emptyChapter(name, { startFen });
    const nextRep: Repertoire = { ...repertoire, chapters: [...repertoire.chapters, ch], updatedAt: Date.now() };
    set((state) => ({ store: { ...state.store, repertoires: replaceRepertoire(state.store.repertoires, nextRep) } }));
    set({
      chapterId: ch.id,
      path: [ch.rootId],
      selectedSquare: null,
      arrows: [],
      userHighlights: {},
      mode: 'study',
      drill: null,
      flipped: fenTurn(startFen) === 'b',
    });
    saveSession({ repertoireId: repertoire.id, chapterId: ch.id });
    return true;
  },
});
