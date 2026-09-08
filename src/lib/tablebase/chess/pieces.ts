import { PIECE_ORDER } from "./constants";
import type { EndgameKind, EndgamePieces } from "./types";

export function sortPieces(pieces: string[]): string[] {
  return [...pieces].sort(
    (a, b) =>
      PIECE_ORDER.indexOf(a as (typeof PIECE_ORDER)[number]) -
      PIECE_ORDER.indexOf(b as (typeof PIECE_ORDER)[number]),
  );
}

export function materialToken(pieces: readonly string[]): string {
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

export function pieceCount(fen: string): number {
  return (fen.split(" ")[0].match(/[pnbrqkPNBRQK]/g) ?? []).length;
}
