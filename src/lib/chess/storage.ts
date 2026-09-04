import { createSeedStore } from "./seed";
import type { OpeningStore } from "./types";

const KEY = "movetrainer:store:v1";

export function loadStore(): OpeningStore {
  if (typeof window === "undefined") return createSeedStore();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return createSeedStore();
    const parsed = JSON.parse(raw) as OpeningStore;
    if (parsed?.version !== 1 || !Array.isArray(parsed.repertoires)) {
      return createSeedStore();
    }
    return parsed;
  } catch {
    return createSeedStore();
  }
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
  const fresh = createSeedStore();
  saveStore(fresh);
  return fresh;
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
