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
const FILES = "abcdefgh";
const ALL_SQUARES = Array.from(
  { length: 64 },
  (_, i) => FILES[i % 8] + String(8 - Math.floor(i / 8)),
);
const GENERATE_ATTEMPTS = 500;
const KEY = "tablebase:deck:v2";

export const ENDGAME_CONFIGS = {
  KP_K: { white: ["k", "p"], black: ["k"] },
  KR_K: { white: ["k", "r"], black: ["k"] },
  KQ_K: { white: ["k", "q"], black: ["k"] },
  KBB_K: { white: ["k", "b", "b"], black: ["k"] },
  KBN_K: { white: ["k", "b", "n"], black: ["k"] },
  KRB_K: { white: ["k", "r", "b"], black: ["k"] },
  KQ_KR: { white: ["k", "q"], black: ["k", "r"] },
  KRP_KR: { white: ["k", "r", "p"], black: ["k", "r"] },
} as const;

export type EndgameKind = keyof typeof ENDGAME_CONFIGS;
export type EndgamePieces = { white: readonly string[]; black: readonly string[] };

export const ENDGAME_IDS = Object.keys(ENDGAME_CONFIGS) as EndgameKind[];

export function isEndgameKind(value: unknown): value is EndgameKind {
  return typeof value === "string" && value in ENDGAME_CONFIGS;
}

function labelOf(kind: EndgameKind) {
  const { white, black } = ENDGAME_CONFIGS[kind];
  const fmt = (pieces: readonly string[]) =>
    pieces.map((p) => NAMES[p.toLowerCase()] ?? p.toUpperCase()).join(" + ");
  return `${fmt(white)} vs ${fmt(black)}`;
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
  const { white, black } = ENDGAME_CONFIGS[kind];
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

export const ENDGAMES = ENDGAME_IDS.map((id) => ({
  id,
  label: labelOf(id),
  fen: fallbackFen(id),
}));

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
  const { white, black } = ENDGAME_CONFIGS[kind];
  const expected = [
    ...white.map((p) => p.toUpperCase()),
    ...black.map((p) => p.toLowerCase()),
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
  const config: EndgamePieces = ENDGAME_CONFIGS[kind];
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

export function isWinningEval(evaluation: number | null): boolean {
  return evaluation != null && Math.abs(evaluation) >= WIN_EVAL;
}
