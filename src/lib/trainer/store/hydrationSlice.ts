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
const lastSent = new Map<string, string>();
const pendingPuts = new Map<string, Repertoire>();
const putsInFlight = new Set<string>();

function rememberServerSnapshot(repertoires: Repertoire[]) {
  for (const repertoire of repertoires) {
    lastSent.set(repertoire.id, JSON.stringify(repertoire));
  }
}

function drainPut(id: string) {
  if (putsInFlight.has(id)) return;
  const repertoire = pendingPuts.get(id);
  if (!repertoire) return;
  pendingPuts.delete(id);

  const payload = JSON.stringify(repertoire);
  if (lastSent.get(id) === payload) return;

  putsInFlight.add(id);
  void putRepertoireOnServer(repertoire)
    .then(() => {
      lastSent.set(id, payload);
    })
    .catch(() => {
      lastSent.delete(id);
    })
    .finally(() => {
      putsInFlight.delete(id);
      if (pendingPuts.has(id)) drainPut(id);
    });
}

function pushDirtyRepertoires(repertoires: Repertoire[]) {
  for (const repertoire of repertoires) {
    const payload = JSON.stringify(repertoire);
    if (lastSent.get(repertoire.id) === payload) continue;
    pendingPuts.set(repertoire.id, repertoire);
    drainPut(repertoire.id);
  }
}

/** Incoming trees fill gaps; in-memory trees that were edited more recently win. */
function mergeLoaded(current: Repertoire[], incoming: Repertoire[]): Repertoire[] {
  const next = [...current];
  for (const repertoire of incoming) {
    const index = next.findIndex((r) => r.id === repertoire.id);
    if (index === -1) next.push(repertoire);
    else if (next[index]!.updatedAt <= repertoire.updatedAt) next[index] = repertoire;
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
      let snapshotFromServer = full && loadedFromApi;
      if (loadedFromApi && !full && library.length > 0) {
        const session = loadSession();
        const targetId =
          library.find((entry) => entry.id === session?.repertoireId)?.id ?? library[0]!.id;
        const inMemory = get().store.repertoires.find((r) => r.id === targetId);
        const detail = inMemory ?? (await fetchRepertoireDetail(targetId));
        loaded = detail ? [detail] : [];
        snapshotFromServer = !inMemory && Boolean(detail);
      }

      const { repertoire, chapter } = pickSession(loaded);
      const prev = get();
      const nextLoaded = full ? loaded : mergeLoaded(prev.store.repertoires, loaded);
      if (snapshotFromServer) rememberServerSnapshot(loaded);

      const keepNav =
        prev.ready &&
        Boolean(repertoire && chapter) &&
        prev.repId === repertoire!.id &&
        prev.chapterId === chapter!.id;

      set({
        library,
        store: { version: 1, repertoires: nextLoaded },
        settings: loadSettings(),
        ready: true,
        ...(repertoire && chapter
          ? {
              repId: repertoire.id,
              chapterId: chapter.id,
              ...(keepNav ? {} : { path: [chapter.rootId], flipped: repertoire.side === 'black' }),
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

    rememberServerSnapshot([repertoire]);

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

    if (persistTimer) clearTimeout(persistTimer);
    persistTimer = setTimeout(() => {
      persistTimer = null;
      pushDirtyRepertoires(get().store.repertoires);
    }, 400);
  },

  persistNow: () => {
    const { repId, chapterId } = get();
    if (repId && chapterId) saveSession({ repertoireId: repId, chapterId });

    if (persistTimer) {
      clearTimeout(persistTimer);
      persistTimer = null;
    }
    pushDirtyRepertoires(get().store.repertoires);
  },
});
