"use client";

import { Chess } from "chess.js";
import { fenTurn } from "@/lib/tablebase/chess/moves";
import { useTablebaseStore } from "@/stores/tablebase-store";

export function BoardToolbar() {
  const fen = useTablebaseStore((s) => s.fen);
  const loading = useTablebaseStore((s) => s.loading);

  const turn = fenTurn(fen);
  let inCheck = false;
  try {
    inCheck = new Chess(fen).inCheck();
  } catch {
    inCheck = false;
  }

  return (
    <div className="mb-2 flex w-full shrink-0 items-center justify-between px-1 mt-2">
      <span className="font-mono text-micro text-muted tabular-nums">
        Turn: {turn === "w" ? "White" : "Black"}
        {inCheck ? " · check" : ""}
        {loading ? " · tablebase" : ""}
      </span>
    </div>
  );
}
