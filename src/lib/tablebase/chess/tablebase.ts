import type { EngineLine, TablebaseMove, TablebaseResponse } from "./types";

export function tablebaseScore(
  category: string | undefined,
  turn: "w" | "b",
): number {
  const side = turn === "w" ? 1 : -1;
  switch (category) {
    case "win":
    case "cursed-win":
      return 10 * side;
    case "loss":
    case "blessed-loss":
      return -10 * side;
    default:
      return 0;
  }
}

export function formatTbEval(
  category: string | undefined,
  dtm: number | null | undefined,
  turn: "w" | "b",
): string {
  const score = tablebaseScore(category, turn);
  if (!category || category === "draw") return "0.00";
  const sign = score > 0 ? "+" : "-";
  if (dtm != null) return `${sign}M${Math.abs(dtm)}`;
  return score > 0 ? "+10.00" : "-10.00";
}

export function tablebaseLines(
  moves: TablebaseMove[] | undefined,
  turn: "w" | "b",
): EngineLine[] {
  return (moves ?? []).slice(0, 5).map((move, i) => ({
    multipv: i + 1,
    uci: move.uci,
    pv: move.uci,
    evaluation: tablebaseScore(move.category, turn),
    depth: move.dtm ?? 0,
    san: move.san,
  }));
}

export async function fetchTablebase(
  fen: string,
  signal?: AbortSignal,
): Promise<TablebaseResponse> {
  const res = await fetch(`/api/tablebase?fen=${encodeURIComponent(fen)}`, {
    signal,
  });
  const data = (await res.json()) as TablebaseResponse & { error?: string };
  if (!res.ok) throw new Error(data.error || "Could not load tablebase");
  return data;
}
