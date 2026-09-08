"use client";

import { tablebaseScore } from "@/lib/tablebase/chess/tablebase";
import { fenTurn } from "@/lib/tablebase/chess/moves";
import { useTablebaseStore } from "@/stores/tablebase-store";

export function EvalBar() {
  const result = useTablebaseStore((s) => s.result);
  const fen = useTablebaseStore((s) => s.fen);
  const localLines = useTablebaseStore((s) => s.localLines);
  const turn = fenTurn(fen);

  const whiteScore = result
    ? tablebaseScore(result.category, "w")
    : (localLines[0]?.evaluation ?? 0) * (turn === "w" ? 1 : -1);

  const t = Math.max(-1, Math.min(1, whiteScore / 10));
  const whitePct = (0.5 + t / 2) * 100;

  return (
    <div
      className="relative h-2 w-full overflow-hidden rounded-full bg-board-dark"
      aria-hidden="true"
    >
      <div
        className="absolute inset-y-0 left-0 bg-board-light transition-[width] duration-(--motion-fast) ease-(--ease-out)"
        style={{ width: `${whitePct}%` }}
      />
    </div>
  );
}
