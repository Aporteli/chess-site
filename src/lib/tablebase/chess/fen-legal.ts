import { Chess } from "chess.js";
import { getEndgameConfig } from "./kinds";
import type { EndgameKind } from "./types";

export function isValidFen(value: string): boolean {
  try {
    new Chess(value);
    return true;
  } catch {
    return false;
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
