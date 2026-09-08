import { loadSession, loadSettings, loadStore, saveSession, saveStore } from '@/lib/chess';
import type { HydrationActions, TrainerSlice } from './types';

let persistTimer: ReturnType<typeof setTimeout> | null = null;

export const createHydrationSlice: TrainerSlice<HydrationActions> = (set, get) => ({
  hydrate: () => {
    const loaded = loadStore();
    const session = loadSession();
    const first = loaded.repertoires.find((r) => r.id === session?.repertoireId) ?? loaded.repertoires[0];
    const firstChapter = first?.chapters.find((c) => c.id === session?.chapterId) ?? first?.chapters[0];

    set({
      store: loaded,
      settings: loadSettings(),
      ...(first && firstChapter
        ? {
            repId: first.id,
            chapterId: firstChapter.id,
            path: [firstChapter.rootId],
            flipped: first.side === 'black',
          }
        : {}),
      ready: true,
    });
  },

  persist: () => {
    const { store, repId, chapterId } = get();
    if (persistTimer) clearTimeout(persistTimer);
    persistTimer = setTimeout(() => saveStore(store), 250);
    if (repId && chapterId) saveSession({ repertoireId: repId, chapterId });
  },
});
