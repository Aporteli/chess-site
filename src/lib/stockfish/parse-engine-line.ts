import type { EngineLine } from "./types";

export type ParsedInfo = {
  score: number | null;
  depth: number;
  nps: number;
  nodes: number;
  line: EngineLine | null;
};

export function parseEngineInfo(
  line: string,
  currentTurn: "w" | "b",
): ParsedInfo | null {
  if (!line.startsWith("info")) return null;

  const mate = line.match(/score mate (-?\d+)/);
  const cp = line.match(/score cp (-?\d+)/);

  let score: number | null = null;

  if (mate) {
    const n = Number.parseInt(mate[1], 10);
    const isWhite = currentTurn === "w";
    score = n > 0
      ? isWhite ? 100 : -100
      : isWhite ? -100 : 100;
  } else if (cp) {
    const rawCp = Number.parseInt(cp[1], 10) / 100;
    score = currentTurn === "b" ? -rawCp : rawCp;
  }

  const depth = Number(line.match(/\bdepth (\d+)/)?.[1] ?? 0);
  const nps = Number(line.match(/\bnps (\d+)/)?.[1] ?? 0);
  const nodes = Number(line.match(/\bnodes (\d+)/)?.[1] ?? 0);
  const pvMatch = line.match(/ pv (.+)$/);
  const multipv = Number(line.match(/multipv (\d+)/)?.[1] ?? 1);

  if (!pvMatch) {
    return { score, depth, nps, nodes, line: null };
  }

  const pv = pvMatch[1].trim();
  const uci = pv.split(" ")[0] ?? "";

  return {
    score,
    depth,
    nps,
    nodes,
    line: uci
      ? { multipv, uci, pv, evaluation: score ?? 0, depth }
      : null,
  };
}
