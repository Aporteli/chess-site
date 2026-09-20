import {
  chessFromFen,
  createSeedStore,
  fenTurn,
  replaceRepertoire,
  saveSession,
  uid,
  type Repertoire,
} from '@/lib/chess';
import {
  createRepertoireOnServer,
  deleteRepertoiresOnServer,
} from '@/lib/chess/repertoire-api';
import { emptyChapter } from '@/lib/chess/tree/chapter-factory';
import { deriveActive } from './deriveActive';
import type { LibraryActions, TrainerSlice } from './types';

function selectRepertoireState(rep: Repertoire) {
  const chapter = rep.chapters[0];
  return {
    repId: rep.id,
    chapterId: chapter?.id ?? '',
    path: chapter ? [chapter.rootId] : [],
    flipped: rep.side === 'black' as const,
    mode: 'study' as const,
    drill: null,
  };
}

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
    set(selectRepertoireState(rep));
    void createRepertoireOnServer(rep).catch((err) => {
      console.warn('[createRepertoire] POST failed.', err);
    });
  },

  ingestRepertoire: (repertoire) => {
    const chapter = repertoire.chapters[0];
    set((state) => ({
      store: {
        ...state.store,
        repertoires: state.store.repertoires.some((r) => r.id === repertoire.id)
          ? replaceRepertoire(state.store.repertoires, repertoire)
          : [...state.store.repertoires, repertoire],
      },
      ...selectRepertoireState(repertoire),
      selectedSquare: null,
      arrows: [],
      userHighlights: {},
    }));
    if (chapter) saveSession({ repertoireId: repertoire.id, chapterId: chapter.id });
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
    void get().deleteRepertoires([id]);
  },

  deleteRepertoires: async (ids) => {
    const { store, repId } = get();
    const idSet = new Set(ids);
    const next = store.repertoires.filter((r) => !idSet.has(r.id));

    set({ store: { ...store, repertoires: next } });

    if (next.length === 0) {
      set({
        repId: '',
        chapterId: '',
        path: [],
        mode: 'study',
        drill: null,
      });
    } else if (idSet.has(repId)) {
      const first = next[0]!;
      set(selectRepertoireState(first));
    }

    try {
      await deleteRepertoiresOnServer(ids);
    } catch (err) {
      console.warn('[deleteRepertoires] DB delete failed. Local change kept.', err);
    }
  },

  resetToSeed: () => {
    const existingIds = get().store.repertoires.map((r) => r.id);
    const fresh = createSeedStore();
    const first = fresh.repertoires[0]!;
    set({
      store: fresh,
      ...selectRepertoireState(first),
    });

    void (async () => {
      try {
        if (existingIds.length > 0) await deleteRepertoiresOnServer(existingIds);
        for (const repertoire of fresh.repertoires) {
          await createRepertoireOnServer(repertoire);
        }
      } catch (err) {
        console.warn('[resetToSeed] DB sync failed.', err);
      }
    })();
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
