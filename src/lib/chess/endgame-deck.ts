import { Chess } from "chess.js";
import { uid } from "./ids";
import type { EngineLine } from "./use-stockfish";

const NAMES: Record<string, string> = {
  k: "King",
  q: "Queen",
  r: "Rook",
  b: "Bishop",
  n: "Knight",
  p: "Pawn",
};

const WHITE_GLYPH: Record<string, string> = {
  k: "♔",
  q: "♕",
  r: "♖",
  b: "♗",
  n: "♘",
  p: "♙",
};
const BLACK_GLYPH: Record<string, string> = {
  k: "♚",
  q: "♛",
  r: "♜",
  b: "♝",
  n: "♞",
  p: "♟",
};

const FILES = "abcdefgh";
const ALL_SQUARES = Array.from(
  { length: 64 },
  (_, i) => FILES[i % 8] + String(8 - Math.floor(i / 8)),
);
const GENERATE_ATTEMPTS = 500;
const KEY = "tablebase:deck:v2";
const KINDS_KEY = "tablebase:kinds:v1";
const HIDDEN_KEY = "tablebase:hidden-kinds:v1";
const PIECE_ORDER = ["k", "q", "r", "b", "n", "p"] as const;

export const ENDGAME_CONFIGS = {
  KP_K: { white: ["k", "p"], black: ["k"] },
  KR_K: { white: ["k", "r"], black: ["k"] },
  KQ_K: { white: ["k", "q"], black: ["k"] },
  KBB_K: { white: ["k", "b", "b"], black: ["k"] },
  KBN_K: { white: ["k", "b", "n"], black: ["k"] },
  KRB_K: { white: ["k", "r", "b"], black: ["k"] },
  KQ_KR: { white: ["k", "q"], black: ["k", "r"] },
  KRP_KR: { white: ["k", "r", "p"], black: ["k", "r"] },
  KRPP_KR: { white: ["k", "r", "p", "p"], black: ["k", "r"] },
} as const;

export type EndgameKind = string;
export type EndgamePieces = {
  white: readonly string[];
  black: readonly string[];
};
export type EndgameEntry = {
  id: EndgameKind;
  label: string;
  icons: string;
  fen: string;
};

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
    if (Array.isArray(parsed)) {
      for (const item of parsed) {
        if (
          item?.id &&
          Array.isArray(item.white) &&
          Array.isArray(item.black)
        ) {
          next[item.id] = { white: item.white, black: item.black };
        }
      }
    }
    return next;
  } catch {
    return {};
  }
}

function loadCustomKinds(): Record<string, EndgamePieces> {
  return customKinds;
}

/** Call from a client effect only — localStorage must not run during SSR. */
export function hydrateCustomKinds(): Record<string, EndgamePieces> {
  if (typeof window === "undefined" || customHydrated) return customKinds;
  customHydrated = true;
  customKinds = readStoredKinds();
  try {
    const raw = window.localStorage.getItem(HIDDEN_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    hiddenKinds = new Set(Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : []);
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
  const payload: StoredKind[] = Object.entries(loadCustomKinds())
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
  return { ...ENDGAME_CONFIGS, ...loadCustomKinds() };
}

export function getEndgameConfig(kind: EndgameKind): EndgamePieces | undefined {
  return allEndgameConfigs()[kind];
}

function sortPieces(pieces: string[]): string[] {
  return [...pieces].sort(
    (a, b) =>
      PIECE_ORDER.indexOf(a as (typeof PIECE_ORDER)[number]) -
      PIECE_ORDER.indexOf(b as (typeof PIECE_ORDER)[number]),
  );
}

function materialToken(pieces: readonly string[]): string {
  const counts: Record<string, number> = {};
  for (const p of pieces) {
    const key = p.toLowerCase();
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return PIECE_ORDER.flatMap((p) =>
    Array.from({ length: counts[p] ?? 0 }, () => p.toUpperCase()),
  ).join("");
}

export function piecesFromFen(fen: string): EndgamePieces | null {
  const board = fen.split(" ")[0] ?? "";
  const white: string[] = [];
  const black: string[] = [];
  for (const ch of board) {
    if (/[KQRBNP]/.test(ch)) white.push(ch.toLowerCase());
    else if (/[kqrbnp]/.test(ch)) black.push(ch);
  }
  if (!white.includes("k") || !black.includes("k")) return null;
  return { white: sortPieces(white), black: sortPieces(black) };
}

export function kindFromFen(fen: string): EndgameKind | null {
  const pieces = piecesFromFen(fen);
  if (!pieces) return null;
  return `${materialToken(pieces.white)}_${materialToken(pieces.black)}`;
}

/** Adds a material type to the catalog when a scanned FEN is new. */
export function registerEndgameFromFen(fen: string): EndgameKind | null {
  const pieces = piecesFromFen(fen);
  if (!pieces) return null;
  const kind = `${materialToken(pieces.white)}_${materialToken(pieces.black)}`;
  if (!(kind in allEndgameConfigs())) {
    const next = { ...loadCustomKinds(), [kind]: pieces };
    customKinds = next;
    persistCustomKinds();
  }
  hiddenKinds.delete(kind);
  persistHiddenKinds();
  return kind;
}

export function endgameIcons(kind: EndgameKind): string {
  const cfg = getEndgameConfig(kind);
  if (!cfg) return kind;
  return `${cfg.white.map((p) => WHITE_GLYPH[p] ?? p).join("")} vs ${cfg.black
    .map((p) => BLACK_GLYPH[p] ?? p)
    .join("")}`;
}

export const ENDGAME_IDS = Object.keys(ENDGAME_CONFIGS) as Array<
  keyof typeof ENDGAME_CONFIGS
>;

export function isEndgameKind(value: unknown): value is EndgameKind {
  return typeof value === "string" && value in allEndgameConfigs();
}

function labelOf(kind: EndgameKind) {
  const cfg = getEndgameConfig(kind);
  if (!cfg) return kind;
  const fmt = (pieces: readonly string[]) =>
    pieces.map((p) => NAMES[p.toLowerCase()] ?? p.toUpperCase()).join(" + ");
  return `${fmt(cfg.white)} vs ${fmt(cfg.black)}`;
}

function fenFromPlacements(placements: [string, string][]): string {
  const rows = Array.from({ length: 8 }, () => Array<string>(8).fill(""));
  for (const [piece, sq] of placements) {
    rows[8 - Number(sq[1])][sq.charCodeAt(0) - 97] = piece;
  }
  const boardFen = rows
    .map((row) => {
      let s = "";
      let empty = 0;
      for (const c of row) {
        if (!c) empty += 1;
        else {
          if (empty) s += empty;
          empty = 0;
          s += c;
        }
      }
      return s + (empty ? String(empty) : "");
    })
    .join("/");
  return `${boardFen} w - - 0 1`;
}

function fallbackFen(kind: EndgameKind): string {
  const cfg = getEndgameConfig(kind);
  if (!cfg) return "8/8/8/8/8/8/8/8 w - - 0 1";
  const { white, black } = cfg;
  const placements: [string, string][] = [];
  let wi = 0;
  let bi = 0;
  for (const p of white) {
    const pawn = p.toLowerCase() === "p";
    placements.push([p.toUpperCase(), `${FILES[wi++]}${pawn ? "2" : "1"}`]);
  }
  for (const p of black) {
    const pawn = p.toLowerCase() === "p";
    placements.push([p.toLowerCase(), `${FILES[7 - bi++]}${pawn ? "7" : "8"}`]);
  }
  return fenFromPlacements(placements);
}

export function listBuiltinEndgames(): EndgameEntry[] {
  return Object.keys(ENDGAME_CONFIGS).map((id) => ({
    id,
    label: labelOf(id),
    icons: endgameIcons(id),
    fen: fallbackFen(id),
  }));
}

export function listEndgames(): EndgameEntry[] {
  return Object.keys(allEndgameConfigs())
    .filter((id) => !hiddenKinds.has(id))
    .map((id) => ({
      id,
      label: labelOf(id),
      icons: endgameIcons(id),
      fen: fallbackFen(id),
    }));
}

export const ENDGAMES = listBuiltinEndgames();

export type EndgameCard = {
  id: string;
  fen: string;
  kind: EndgameKind;
  evaluation: number | null;
  bestMove: string | null;
  depth: number;
  lines: EngineLine[];
  createdAt: number;
};

export type EndgameDeck = {
  id: string;
  name: string;
  cards: EndgameCard[];
  cursor: number;
  updatedAt: number;
};

export const DECK_BATCH = 8;
export const WIN_EVAL = 3;

function takeSquare(used: Set<string>, pawn: boolean): string | null {
  const pool = ALL_SQUARES.filter((sq) => {
    if (used.has(sq)) return false;
    if (pawn && (sq[1] === "1" || sq[1] === "8")) return false;
    return true;
  });
  if (!pool.length) return null;
  const sq = pool[(Math.random() * pool.length) | 0]!;
  used.add(sq);
  return sq;
}

export function emptyDeck(name = "Endgame deck"): EndgameDeck {
  return {
    id: uid("deck"),
    name,
    cards: [],
    cursor: 0,
    updatedAt: Date.now(),
  };
}

export function loadDeck(): EndgameDeck {
  if (typeof window === "undefined") return emptyDeck();
  hydrateCustomKinds();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyDeck();
    const parsed = JSON.parse(raw) as EndgameDeck;
    if (!parsed?.id || !Array.isArray(parsed.cards)) return emptyDeck();
    return {
      ...emptyDeck(parsed.name),
      ...parsed,
      cards: parsed.cards.filter(
        (c) => typeof c?.fen === "string" && isEndgameKind(c.kind),
      ),
      cursor: Math.max(0, parsed.cursor ?? 0),
    };
  } catch {
    return emptyDeck();
  }
}

export function saveDeck(deck: EndgameDeck) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      KEY,
      JSON.stringify({ ...deck, updatedAt: Date.now() }),
    );
  } catch {
    /* quota / private mode */
  }
}

export function isLegalChessFen(fen: string): boolean {
  try {
    const g = new Chess(fen);
    const parts = fen.trim().split(/\s+/);
    const oppTurn = g.turn() === "w" ? "b" : "w";
    const flipped = `${parts[0]} ${oppTurn} ${parts[2] ?? "-"} ${parts[3] ?? "-"} ${parts[4] ?? "0"} ${parts[5] ?? "1"}`;
    const opp = new Chess();
    opp.load(flipped, { skipValidation: true });
    return !opp.inCheck();
  } catch {
    return false;
  }
}

export function isLegalPlayableFen(fen: string): boolean {
  try {
    const g = new Chess(fen);
    return isLegalChessFen(fen) && !g.isGameOver() && !g.inCheck();
  } catch {
    return false;
  }
}

export function fenMatchesKind(fen: string, kind: EndgameKind): boolean {
  const board = fen.split(" ")[0] ?? "";
  const pieces = [...board.replace(/[\d/]/g, "")].sort().join("");
  const cfg = getEndgameConfig(kind);
  if (!cfg) return false;
  const expected = [
    ...cfg.white.map((p) => p.toUpperCase()),
    ...cfg.black.map((p) => p.toLowerCase()),
  ]
    .sort()
    .join("");
  return pieces === expected;
}

// fixed: removed duplicate and malformed function declaration
export function generateEndgameFen(
  kind: EndgameKind,
  seen: ReadonlySet<string> = new Set(),
): string | null {
  const config = getEndgameConfig(kind);
  if (!config) return null;
  for (let n = 0; n < GENERATE_ATTEMPTS; n++) {
    const used = new Set<string>();
    const placements: [string, string][] = [];
    let ok = true;
    for (const p of config.white) {
      const sq = takeSquare(used, p.toLowerCase() === "p");
      if (!sq) {
        ok = false;
        break;
      }
      placements.push([p.toUpperCase(), sq]);
    }
    if (!ok) continue;
    for (const p of config.black) {
      const sq = takeSquare(used, p.toLowerCase() === "p");
      if (!sq) {
        ok = false;
        break;
      }
      placements.push([p.toLowerCase(), sq]);
    }
    if (!ok) continue;
    const fen = fenFromPlacements(placements);
    if (
      !seen.has(fen) &&
      isLegalPlayableFen(fen) &&
      fenMatchesKind(fen, kind)
    ) {
      return fen;
    }
  }
  return null;
}

export function makeCard(input: {
  fen: string;
  kind: EndgameKind;
  evaluation: number | null;
  bestMove: string | null;
  depth: number;
  lines: EngineLine[];
}): EndgameCard {
  return {
    id: uid("card"),
    fen: input.fen,
    kind: input.kind,
    evaluation: input.evaluation,
    bestMove: input.bestMove,
    depth: input.depth,
    lines: input.lines.map((line) => ({ ...line })),
    createdAt: Date.now(),
  };
}

export function upsertCard(deck: EndgameDeck, card: EndgameCard): EndgameDeck {
  const existing = deck.cards.findIndex((c) => c.fen === card.fen);
  const cards =
    existing >= 0
      ? deck.cards.map((c, i) =>
          i === existing ? { ...c, ...card, id: c.id } : c,
        )
      : [...deck.cards, card];
  const cursor = existing >= 0 ? existing : cards.length - 1;
  const next = { ...deck, cards, cursor, updatedAt: Date.now() };
  saveDeck(next);
  return next;
}

export function removeCard(deck: EndgameDeck, cardId: string): EndgameDeck {
  const cards = deck.cards.filter((c) => c.id !== cardId);
  const cursor = Math.min(deck.cursor, Math.max(0, cards.length - 1));
  const next = { ...deck, cards, cursor, updatedAt: Date.now() };
  saveDeck(next);
  return next;
}

export function removeCardsByKind(
  deck: EndgameDeck,
  kind: EndgameKind,
): EndgameDeck {
  const cards = deck.cards.filter((c) => c.kind !== kind);
  const cursor = Math.min(deck.cursor, Math.max(0, cards.length - 1));
  const next = { ...deck, cards, cursor, updatedAt: Date.now() };
  saveDeck(next);
  return next;
}

export function removeAllCards(deck: EndgameDeck): EndgameDeck {
  const next = { ...deck, cards: [], cursor: 0, updatedAt: Date.now() };
  saveDeck(next);
  return next;
}

export function isBuiltinKind(kind: EndgameKind): boolean {
  return kind in ENDGAME_CONFIGS;
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

export function isWinningEval(evaluation: number | null): boolean {
  return evaluation != null && Math.abs(evaluation) >= WIN_EVAL;
}
