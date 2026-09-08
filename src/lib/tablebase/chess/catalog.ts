import { ENDGAME_CONFIGS } from "./configs";
import { fallbackFen } from "./fen-encode";
import { glyphsFor, NAMES } from "./glyphs";
import {
  allEndgameConfigs,
  getEndgameConfig,
  isKindHidden,
} from "./kinds";
import type { EndgameEntry, EndgameKind } from "./types";

export function endgameIcons(kind: EndgameKind): string {
  const cfg = getEndgameConfig(kind);
  if (!cfg) return kind;
  return `${glyphsFor(cfg.white, "w")} vs ${glyphsFor(cfg.black, "b")}`;
}

function labelOf(kind: EndgameKind) {
  const cfg = getEndgameConfig(kind);
  if (!cfg) return kind;
  const fmt = (pieces: readonly string[]) =>
    pieces.map((p) => NAMES[p.toLowerCase()] ?? p.toUpperCase()).join(" + ");
  return `${fmt(cfg.white)} vs ${fmt(cfg.black)}`;
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
    .filter((id) => !isKindHidden(id))
    .map((id) => ({
      id,
      label: labelOf(id),
      icons: endgameIcons(id),
      fen: fallbackFen(id),
    }));
}

export const ENDGAMES = listBuiltinEndgames();
export const START_FEN = ENDGAMES[0]?.fen ?? "8/8/8/8/8/8/8/8 w - - 0 1";
