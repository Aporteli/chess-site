import { createSeedStore } from "./seed";
import type { OpeningStore } from "./types";

const KEY = "movetrainer:store:v1";

/** Reads repertoire data previously stored in localStorage. Null if none. Does not seed. */
export function readPersistedStore(): OpeningStore | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as OpeningStore;
    if (parsed?.version !== 1 || !Array.isArray(parsed.repertoires) || parsed.repertoires.length === 0) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearPersistedStore() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export function loadStore(): OpeningStore {
  return readPersistedStore() ?? createSeedStore();
}

export function saveStore(store: OpeningStore) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    // Quota or private mode — keep working in memory.
  }
}

export function resetStore(): OpeningStore {
  return createSeedStore();
}

const SETTINGS_KEY = "movetrainer:settings:v1";

export interface BoardSettings {
  sound: boolean;
  legalHints: boolean;
  animations: boolean;
  coordinates: boolean;
  autoReplyDelay: number;
  confirmPromotion: boolean;
}

export const DEFAULT_SETTINGS: BoardSettings = {
  sound: true,
  legalHints: true,
  animations: true,
  coordinates: true,
  autoReplyDelay: 400,
  confirmPromotion: true,
};

export function loadSettings(): BoardSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<BoardSettings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: BoardSettings) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    /* ignore */
  }
}

const SESSION_KEY = "movetrainer:session:v1";

export interface SessionPointer {
  repertoireId: string;
  chapterId: string;
}

export function loadSession(): SessionPointer | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as SessionPointer) : null;
  } catch {
    return null;
  }
}

export function saveSession(pointer: SessionPointer) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(pointer));
  } catch {
    /* ignore */
  }
}
