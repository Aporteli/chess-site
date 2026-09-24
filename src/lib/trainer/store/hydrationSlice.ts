import {
  clearPersistedStore,
  loadSession,
  loadSettings,
  readPersistedStore,
  saveSession,
  type Repertoire,
  type RepertoireSummary,
} from '@/lib/chess';
import {
  createRepertoireOnServer,
  fetchRepertoire,
  fetchRepertoireSummaries,
  fetchRepertoires,
  putRepertoireOnServer,
} from '@/lib/chess/repertoire-api';
import { toRepertoireSummary } from './libraryIndex';
import type { HydrationActions, TrainerSlice } from './types';

let persistTimer: ReturnType<typeof setTimeout> | null = null;
let skipNextPersist = false;
const lastSent = new Map<string, string>();

function rememberPersisted(repertoires: Repertoire[]) {
  lastSent.clear();
  for (const repertoire of repertoires) {
    lastSent.set(repertoire.id, JSON.stringify(repertoire));
  }
}

function pushDirtyRepertoires(repertoires: Repertoire[]) {
  for (const repertoire of repertoires) {
    const payload = JSON.stringify(repertoire);
    if (lastSent.get(repertoire.id) === payload) continue;
    void putRepertoireOnServer(repertoire)
      .then(() => {
        lastSent.set(repertoire.id, payload);
      })
      .catch(() => {
        lastSent.delete(repertoire.id);
      });
  }
}

/** Replaces same-id entries and appends the rest, so already-loaded trees survive a hydrate. */
function mergeLoaded(current: Repertoire[], incoming: Repertoire[]): Repertoire[] {
  const next = [...current];
  for (const repertoire of incoming) {
    const index = next.findIndex((r) => r.id === repertoire.id);
    if (index === -1) next.push(repertoire);
    else next[index] = repertoire;
  }
  return next;
}

/** The repertoire + chapter the session pointed at, falling back to the first available. */
function pickSession(repertoires: Repertoire[]) {
  const session = loadSession();
  const repertoire = repertoires.find((r) => r.id === session?.repertoireId) ?? repertoires[0];
  const chapter =
    repertoire?.chapters.find((c) => c.id === session?.chapterId) ?? repertoire?.chapters[0];
  return { repertoire, chapter };
}

async function fetchRepertoireDetail(id: string): Promise<Repertoire | null> {
  try {
    return await fetchRepertoire(id);
  } catch (err) {
    console.warn('[repertoire] Failed to load repertoire.', err);
    return null;
  }
}

async function migrateLocalStore(local: { repertoires: Repertoire[] }): Promise<Repertoire[]> {
  const migrated: Repertoire[] = [];
  for (const repertoire of local.repertoires) {
    try {
      migrated.push(await createRepertoireOnServer(repertoire));
    } catch {
      migrated.push(repertoire);
    }
  }
  return migrated;
}

export const createHydrationSlice: TrainerSlice<HydrationActions> = (set, get) => ({
  hydrate: ({ full = false } = {}) => {
    void (async () => {
      let library: RepertoireSummary[] = [];
      let loaded: Repertoire[] = [];
      let loadedFromApi = false;

      try {
        if (full) {
          loaded = await fetchRepertoires();
          library = loaded.map(toRepertoireSummary);
        } else {
          library = await fetchRepertoireSummaries();
        }
        loadedFromApi = true;
      } catch {
        library = [];
        loaded = [];
      }

      // One-time migration of repertoire data that predates server storage.
      const local = readPersistedStore();
      if (loadedFromApi && library.length === 0 && local) {
        loaded = await migrateLocalStore(local);
        library = loaded.map(toRepertoireSummary);
      } else if (loadedFromApi) {
        clearPersistedStore();
      } else if (local) {
        loaded = local.repertoires;
        library = local.repertoires.map(toRepertoireSummary);
      }

      // Lazy mode: only the open repertoire needs its chapter trees in memory.
      if (loadedFromApi && !full && library.length > 0) {
        const session = loadSession();
        const targetId =
          library.find((entry) => entry.id === session?.repertoireId)?.id ?? library[0]!.id;
        const inMemory = get().store.repertoires.find((r) => r.id === targetId);
        const detail = inMemory ?? (await fetchRepertoireDetail(targetId));
        loaded = detail ? [detail] : [];
      }

      const { repertoire, chapter } = pickSession(loaded);
      const nextLoaded = full ? loaded : mergeLoaded(get().store.repertoires, loaded);

      skipNextPersist = true;
      rememberPersisted(nextLoaded);

      set({
        library,
        store: { version: 1, repertoires: nextLoaded },
        settings: loadSettings(),
        ready: true,
        ...(repertoire && chapter
          ? {
              repId: repertoire.id,
              chapterId: chapter.id,
              path: [chapter.rootId],
              flipped: repertoire.side === 'black',
            }
          : { repId: '', chapterId: '', path: [] }),
      });
    })();
  },

  loadRepertoire: async (id) => {
    const { store, library } = get();
    if (store.repertoires.some((r) => r.id === id)) return;
    if (!library.some((entry) => entry.id === id)) return;

    const repertoire = await fetchRepertoireDetail(id);
    if (!repertoire) return;

    const chapter = repertoire.chapters[0];
    const nextLoaded = mergeLoaded(store.repertoires, [repertoire]);

    skipNextPersist = true;
    rememberPersisted(nextLoaded);

    set({
      store: { version: 1, repertoires: nextLoaded },
      repId: repertoire.id,
      ...(chapter ? { chapterId: chapter.id, path: [chapter.rootId] } : {}),
      flipped: repertoire.side === 'black',
      mode: 'study',
      drill: null,
    });

    if (chapter) saveSession({ repertoireId: repertoire.id, chapterId: chapter.id });
  },

  persist: () => {
    const { repId, chapterId } = get();
    if (repId && chapterId) saveSession({ repertoireId: repId, chapterId });

    if (skipNextPersist) {
      skipNextPersist = false;
      return;
    }

    if (persistTimer) clearTimeout(persistTimer);
    persistTimer = setTimeout(() => {
      persistTimer = null;
      pushDirtyRepertoires(get().store.repertoires);
    }, 400);
  },

  persistNow: () => {
    const { repId, chapterId } = get();
    if (repId && chapterId) saveSession({ repertoireId: repId, chapterId });

    const hadTimer = persistTimer !== null;
    if (persistTimer) {
      clearTimeout(persistTimer);
      persistTimer = null;
    }

    if (skipNextPersist && !hadTimer) {
      skipNextPersist = false;
      return;
    }
    skipNextPersist = false;
    pushDirtyRepertoires(get().store.repertoires);
  },
});
