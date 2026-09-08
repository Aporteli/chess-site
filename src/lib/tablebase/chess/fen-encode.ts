import { FILES } from "./constants";
import { getEndgameConfig } from "./kinds";
import type { EndgameKind } from "./types";

export function fenFromPlacements(placements: [string, string][]): string {
  const rows = Array.from({ length: 8 }, () => Array<string>(8).fill(""));
  for (const [piece, sq] of placements) {
    if (!sq || sq.length < 2) continue;
    const file = sq.charCodeAt(0) - 97;
    const rank = 8 - Number(sq[1]);
    if (rank >= 0 && rank < 8 && file >= 0 && file < 8) {
      rows[rank][file] = piece;
    }
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

export function fallbackFen(kind: EndgameKind): string {
  const cfg = getEndgameConfig(kind);
  if (!cfg) return "8/8/8/8/8/8/8/8 w - - 0 1";
  const placements: [string, string][] = [];
  let wi = 0;
  let bi = 0;
  for (const p of cfg.white) {
    const pawn = p.toLowerCase() === "p";
    placements.push([p.toUpperCase(), `${FILES[wi++]}${pawn ? "2" : "1"}`]);
  }
  for (const p of cfg.black) {
    const pawn = p.toLowerCase() === "p";
    placements.push([p.toLowerCase(), `${FILES[7 - bi++]}${pawn ? "7" : "8"}`]);
  }
  return fenFromPlacements(placements);
}
