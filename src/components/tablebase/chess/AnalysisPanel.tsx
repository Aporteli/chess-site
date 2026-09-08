"use client";

import { playUcis } from "@/lib/tablebase/chess/play";
import { analyzePosition } from "@/lib/tablebase/chess/minimax";
import { fenTurn } from "@/lib/tablebase/chess/moves";
import { formatTbEval, tablebaseLines } from "@/lib/tablebase/chess/tablebase";
import { useTablebaseStore } from "@/stores/tablebase-store";
import { Button } from "@/components/tablebase/ui/button";
import { EvalBar } from "./EvalBar";

export function AnalysisPanel() {
  const result = useTablebaseStore((s) => s.result);
  const fen = useTablebaseStore((s) => s.fen);
  const localLines = useTablebaseStore((s) => s.localLines);
  const enabled = useTablebaseStore((s) => s.engineEnabled);
  const building = useTablebaseStore((s) => s.pipeline !== "idle");
  const gameOver = useTablebaseStore((s) => s.gameOver);
  const loading = useTablebaseStore((s) => s.loading);
  const toggleEngine = useTablebaseStore((s) => s.toggleEngine);
  const setLocalLines = useTablebaseStore((s) => s.setLocalLines);
  const turn = fenTurn(fen);
  const tbLines = result ? tablebaseLines(result.moves, turn) : [];
  const lines = tbLines.length ? tbLines : localLines;

  return (
    <section className="flex min-h-0 flex-col gap-2 rounded-xl bg-surface p-3 shadow-[var(--shadow-border)]">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-base text-fg">Analysis</h2>
        <Button size="tiny" variant={enabled ? "primary" : "secondary"} onClick={toggleEngine}>
          {enabled ? "Auto on" : "Auto off"}
        </Button>
      </div>
      <EvalBar />
      <div className="flex items-center justify-between font-mono text-micro text-muted">
        <span className="uppercase tracking-wider text-accent">
          {loading ? "…" : (result?.category ?? (lines[0] ? "local" : "idle"))}
        </span>
        <span className="tabular-nums">
          {result
            ? formatTbEval(result.category, result.dtm, turn)
            : lines[0]
              ? `${lines[0].evaluation > 0 ? "+" : ""}${lines[0].evaluation.toFixed(2)}`
              : "—"}
          {result?.dtz != null ? ` · DTZ ${result.dtz}` : ""}
        </span>
      </div>
      <div className="flex max-h-28 flex-wrap gap-1 overflow-y-auto">
        {lines.length === 0 ? (
          <p className="text-micro italic text-muted">No lines yet.</p>
        ) : (
          lines.map((line) => (
            <button
              key={`${line.multipv}-${line.uci}`}
              type="button"
              disabled={building || Boolean(gameOver)}
              onClick={() => playUcis([line.uci])}
              className="min-h-9 rounded-sm px-2 font-mono text-2xs text-muted shadow-[var(--shadow-border)] hover:text-fg disabled:opacity-50"
            >
              {line.san ?? line.uci}
            </button>
          ))
        )}
      </div>
      <Button
        size="sm"
        onClick={() => setLocalLines(analyzePosition(fen, 3, 5))}
        disabled={building}
      >
        Local search
      </Button>
    </section>
  );
}
