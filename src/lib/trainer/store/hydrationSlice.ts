import {
  clearPersistedStore,
  loadSession,
  loadSettings,
  readPersistedStore,
  saveSession,
  type Repertoire,
} from '@/lib/chess';
import {
  createRepertoireOnServer,
  fetchRepertoires,
  putRepertoireOnServer,
} from '@/lib/chess/repertoire-api';
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

function applyLoaded(repertoires: Repertoire[]) {
  const session = loadSession();
  const first = repertoires.find((r) => r.id === session?.repertoireId) ?? repertoires[0];
  const firstChapter = first?.chapters.find((c) => c.id === session?.chapterId) ?? first?.chapters[0];

  skipNextPersist = true;
  rememberPersisted(repertoires);

  return {
    store: { version: 1 as const, repertoires },
    settings: loadSettings(),
    ...(first && firstChapter
      ? {
          repId: first.id,
          chapterId: firstChapter.id,
          path: [firstChapter.rootId],
          flipped: first.side === 'black',
        }
      : {
          repId: '',
          chapterId: '',
          path: [] as string[],
        }),
    ready: true,
  };
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
  hydrate: () => {
    void (async () => {
      let repertoires: Repertoire[] = [];
      let loadedFromApi = false;
      try {
        repertoires = await fetchRepertoires();
        loadedFromApi = true;
      } catch {
        repertoires = [];
      }

      const local = readPersistedStore();
      if (loadedFromApi && repertoires.length === 0 && local) {
        repertoires = await migrateLocalStore(local);
        clearPersistedStore();
      } else if (loadedFromApi) {
        clearPersistedStore();
      } else if (local) {
        repertoires = local.repertoires;
      }

      set(applyLoaded(repertoires));
    })();
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
      const latest = get().store;
      for (const repertoire of latest.repertoires) {
        const payload = JSON.stringify(repertoire);
        if (lastSent.get(repertoire.id) === payload) continue;
        lastSent.set(repertoire.id, payload);
        void putRepertoireOnServer(repertoire).catch(() => {
          lastSent.delete(repertoire.id);
        });
      }
    }, 400);
  },
});
