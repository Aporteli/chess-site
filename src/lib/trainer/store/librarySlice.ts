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
  updateRepertoireSideOnServer,
} from '@/lib/chess/repertoire-api';
import { emptyChapter } from '@/lib/chess/tree/chapter-factory';
import { deriveActive } from './deriveActive';
import { toRepertoireSummary, upsertRepertoireSummary } from './libraryIndex';
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
    set((state) => ({
      store: { ...state.store, repertoires: replaceRepertoire(state.store.repertoires, next) },
      library: upsertRepertoireSummary(state.library, next),
    }));
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
    set((state) => ({
      store: { ...state.store, repertoires: [...state.store.repertoires, rep] },
      library: upsertRepertoireSummary(state.library, rep),
    }));
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
      library: upsertRepertoireSummary(state.library, repertoire),
      ...selectRepertoireState(repertoire),
      selectedSquare: null,
      arrows: [],
      userHighlights: {},
    }));
    if (chapter) saveSession({ repertoireId: repertoire.id, chapterId: chapter.id });
  },

  setRepertoireSide: (id, side) => {
    const { store, library, repId, mode } = get();
    const rep = store.repertoires.find((r) => r.id === id);

    if (!rep) {
      // Chapter trees are not in memory — update the index and persist just the side.
      const summary = library.find((entry) => entry.id === id);
      if (!summary || summary.side === side) return;
      set({ library: library.map((entry) => (entry.id === id ? { ...entry, side } : entry)) });
      void updateRepertoireSideOnServer(id, side).catch((err) => {
        console.warn('[setRepertoireSide] PATCH failed.', err);
      });
      return;
    }

    if (rep.side === side) return;

    const nextRep: Repertoire = { ...rep, side, updatedAt: Date.now() };
    set((state) => ({
      store: { ...state.store, repertoires: replaceRepertoire(state.store.repertoires, nextRep) },
      library: upsertRepertoireSummary(state.library, nextRep),
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
    set((state) => ({
      store: { ...state.store, repertoires: replaceRepertoire(state.store.repertoires, next) },
      library: upsertRepertoireSummary(state.library, next),
    }));
    if (get().chapterId === id) {
      set({ chapterId: nextChapters[0]!.id, path: [nextChapters[0]!.rootId] });
    }
  },

  deleteRepertoire: (id) => {
    void get().deleteRepertoires([id]);
  },

  deleteRepertoires: async (ids) => {
    const { store, library, repId } = get();
    const idSet = new Set(ids);
    const nextLoaded = store.repertoires.filter((r) => !idSet.has(r.id));
    const nextLibrary = library.filter((entry) => !idSet.has(entry.id));

    set({
      store: { ...store, repertoires: nextLoaded },
      library: nextLibrary,
    });

    if (nextLibrary.length === 0) {
      set({
        repId: '',
        chapterId: '',
        path: [],
        mode: 'study',
        drill: null,
      });
    } else if (idSet.has(repId)) {
      const inMemory = nextLoaded[0];
      if (inMemory) set(selectRepertoireState(inMemory));
      else void get().loadRepertoire(nextLibrary[0]!.id);
    }

    try {
      await deleteRepertoiresOnServer(ids);
    } catch (err) {
      console.warn('[deleteRepertoires] DB delete failed. Local change kept.', err);
    }
  },

  resetToSeed: () => {
    const existingIds = get().library.map((r) => r.id);
    const fresh = createSeedStore();
    const first = fresh.repertoires[0]!;
    set({
      store: fresh,
      library: fresh.repertoires.map(toRepertoireSummary),
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
    set((state) => ({
      store: { ...state.store, repertoires: replaceRepertoire(state.store.repertoires, nextRep) },
      library: upsertRepertoireSummary(state.library, nextRep),
    }));
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
