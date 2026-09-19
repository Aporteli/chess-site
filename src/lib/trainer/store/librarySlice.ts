import { chessFromFen, fenTurn, replaceRepertoire, resetStore, saveSession, uid, type Repertoire } from '@/lib/chess';
import { emptyChapter } from '@/lib/chess/tree/chapter-factory';
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

  setRepertoireSide: (id, side) => {
    const { store, repId, mode } = get();
    const rep = store.repertoires.find((r) => r.id === id);
    if (!rep || rep.side === side) return;

    const nextRep: Repertoire = { ...rep, side, updatedAt: Date.now() };
    set((state) => ({
      store: { ...state.store, repertoires: replaceRepertoire(state.store.repertoires, nextRep) },
    }));

    if (repId === id) {
      set({ flipped: side === 'black' });
      if (mode === 'drill') {
        setTimeout(() => get().startPractice(), 50);
      }
    }
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

  deleteRepertoires: async (ids) => {
    const { store, repId } = get();
    const idSet = new Set(ids);

    const next = store.repertoires.filter((r) => !idSet.has(r.id));

    // ბოლო repertoire-ს არ ვშლით — თუ ყველა მოინიშნა, seed-ზე ვბრუნდებით
    if (next.length === 0) {
      get().resetToSeed();
    } else {
      // 1. optimistic UI update
      set({ store: { ...store, repertoires: next } });

      if (idSet.has(repId)) {
        const first = next[0]!;
        set({
          repId: first.id,
          chapterId: first.chapters[0]!.id,
          path: [first.chapters[0]!.rootId],
          flipped: first.side === 'black',
          mode: 'study',
          drill: null,
        });
      }
    }

    // 2. DB-დან წაშლა (fire-and-forget + rollback on failure)
    try {
      const res = await fetch('/api/repertoires', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) {
        console.warn(`[deleteRepertoires] DB delete returned ${res.status}. Local change kept.`);
      }
    } catch (err) {
      console.warn('[deleteRepertoires] DB delete failed. Local change kept.', err);
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
