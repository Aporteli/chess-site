import { ALL_SQUARES, GENERATE_ATTEMPTS } from "./constants";
import { fenFromPlacements } from "./fen-encode";
import { fenMatchesKind, isLegalPlayableFen } from "./fen-legal";
import { getEndgameConfig } from "./kinds";
import type { EndgameKind } from "./types";

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
