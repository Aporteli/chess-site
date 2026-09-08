import { ENDGAME_CONFIGS } from "./configs";
import { HIDDEN_KEY, KINDS_KEY } from "./constants";
import { kindFromFen, piecesFromFen } from "./pieces";
import type { EndgameKind, EndgamePieces } from "./types";

type StoredKind = { id: string; white: string[]; black: string[] };

let customKinds: Record<string, EndgamePieces> = {};
let hiddenKinds = new Set<string>();
let customHydrated = false;

function readStoredKinds(): Record<string, EndgamePieces> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KINDS_KEY);
    const parsed = raw ? (JSON.parse(raw) as StoredKind[]) : [];
    const next: Record<string, EndgamePieces> = {};
    if (!Array.isArray(parsed)) return next;
    for (const item of parsed) {
      if (item?.id && Array.isArray(item.white) && Array.isArray(item.black)) {
        next[item.id] = { white: item.white, black: item.black };
      }
    }
    return next;
  } catch {
    return {};
  }
}

export function hydrateCustomKinds(): Record<string, EndgamePieces> {
  if (typeof window === "undefined" || customHydrated) return customKinds;
  customHydrated = true;
  customKinds = readStoredKinds();
  try {
    const raw = window.localStorage.getItem(HIDDEN_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    hiddenKinds = new Set(
      Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [],
    );
  } catch {
    hiddenKinds = new Set();
  }
  return customKinds;
}

function persistHiddenKinds() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(HIDDEN_KEY, JSON.stringify([...hiddenKinds]));
  } catch {
    /* quota / private mode */
  }
}

function persistCustomKinds() {
  if (typeof window === "undefined") return;
  const builtins = new Set(Object.keys(ENDGAME_CONFIGS));
  const payload: StoredKind[] = Object.entries(customKinds)
    .filter(([id]) => !builtins.has(id))
    .map(([id, pieces]) => ({
      id,
      white: [...pieces.white],
      black: [...pieces.black],
    }));
  try {
    window.localStorage.setItem(KINDS_KEY, JSON.stringify(payload));
  } catch {
    /* quota / private mode */
  }
}

export function allEndgameConfigs(): Record<string, EndgamePieces> {
  return { ...ENDGAME_CONFIGS, ...customKinds };
}

export function getEndgameConfig(kind: EndgameKind): EndgamePieces | undefined {
  return allEndgameConfigs()[kind];
}

export function isEndgameKind(value: unknown): value is EndgameKind {
  return typeof value === "string" && value in allEndgameConfigs();
}

export function isKindHidden(kind: string): boolean {
  return hiddenKinds.has(kind);
}

export function registerEndgameFromFen(fen: string): EndgameKind | null {
  const pieces = piecesFromFen(fen);
  if (!pieces) return null;
  const kind = kindFromFen(fen);
  if (!kind) return null;
  if (!(kind in allEndgameConfigs())) {
    customKinds = { ...customKinds, [kind]: pieces };
    persistCustomKinds();
  }
  hiddenKinds.delete(kind);
  persistHiddenKinds();
  return kind;
}

export function removeEndgameKind(kind: EndgameKind): void {
  if (kind in ENDGAME_CONFIGS) {
    hiddenKinds.add(kind);
    persistHiddenKinds();
  }
  if (kind in customKinds) {
    const { [kind]: _removed, ...rest } = customKinds;
    customKinds = rest;
    persistCustomKinds();
  }
}

export function removeAllEndgameKinds(): void {
  customKinds = {};
  persistCustomKinds();
  hiddenKinds = new Set(Object.keys(ENDGAME_CONFIGS));
  persistHiddenKinds();
}
