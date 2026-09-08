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

  // Additional safe defaults for min/max heights
  // and preventing children overlap issues with flex/shrink basis

  return (
    <section
      className="flex flex-col gap-2 rounded-xl bg-surface p-3 shadow-[var(--shadow-border)]"
      style={{
        minHeight: 0,
        height: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div className="flex items-center justify-between gap-2 flex-shrink-0">
        <h2 className="font-display text-base text-fg">Analysis</h2>
        <Button size="tiny" variant={enabled ? "primary" : "secondary"} onClick={toggleEngine}>
          {enabled ? "Auto on" : "Auto off"}
        </Button>
      </div>
      <div className="flex-shrink-0">
        <EvalBar />
      </div>
      <div className="flex items-center justify-between font-mono text-micro text-muted flex-shrink-0">
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
      <div
        className="flex flex-col gap-2 overflow-y-auto min-h-16 max-h-56 p-1"
        style={{
          flexGrow: 1,
          minHeight: "4rem",
          maxHeight: "12rem",
        }}
      >
        {lines.length === 0 ? (
          <p className="text-micro italic text-muted">No lines yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {lines.map((line) => (
              <button
                key={`${line.multipv}-${line.uci}`}
                type="button"
                disabled={building || Boolean(gameOver)}
                onClick={() => playUcis([line.uci])}
                className="min-h-10 rounded px-3 py-1 font-mono text-xs text-muted shadow-[var(--shadow-border)] hover:text-fg disabled:opacity-50 bg-surface/80"
                style={{ minWidth: "3.5rem" }}
              >
                {line.san ?? line.uci}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex-shrink-0 mt-2">
        <Button
          size="sm"
          onClick={() => setLocalLines(analyzePosition(fen, 3, 5))}
          disabled={building}
          className="w-full"
        >
          Local search
        </Button>
      </div>
    </section>
  );
}
