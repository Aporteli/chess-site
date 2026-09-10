"use client";

import { Loader2 } from "lucide-react";
import { useGeneratePuzzle } from "@/hooks/puzzle/use-generate-puzzle";
import type { FENSide } from "@/lib/types";

export function GeneratePanel() {
  const {
    fenInput,
    setFenInput,
    sideToMove,
    setSideToMove,
    loading,
    error,
    handleSubmit,
  } = useGeneratePuzzle();

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface p-4 shadow-panel">
      <h2 className="font-serif text-lg text-accent-gold-bright">Generate</h2>
      <p className="mt-1 font-mono text-[11px] text-text-muted">
        Optional starting FEN. Blank position uses a random tactic.
      </p>

      <form onSubmit={handleSubmit} className="mt-3 space-y-3">
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            FEN
          </span>
          <input
            type="text"
            value={fenInput}
            onChange={(e) => setFenInput(e.target.value)}
            disabled={loading}
            placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
            className="rounded-md border border-border-default bg-bg-elevated px-2.5 py-2 font-mono text-xs text-text-primary outline-none transition focus:border-accent-gold/60 disabled:opacity-50"
            autoComplete="off"
            spellCheck={false}
          />
        </label>

        <div className="flex flex-wrap items-end gap-3">
          <label className="flex min-w-[8rem] flex-1 flex-col gap-1.5">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Side to move
            </span>
            <select
              value={sideToMove}
              onChange={(e) => setSideToMove(e.target.value as FENSide)}
              disabled={loading}
              className="rounded-md border border-border-default bg-bg-elevated px-2.5 py-2 font-mono text-xs outline-none focus:border-accent-gold/60 disabled:opacity-50"
            >
              <option value="w">White</option>
              <option value="b">Black</option>
            </select>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-[38px] flex-1 items-center justify-center gap-2 rounded-md bg-accent-gold-bright px-4 font-mono text-xs font-semibold text-bg-deepest transition hover:bg-accent-gold disabled:cursor-not-allowed disabled:opacity-75"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Generating..." : "Generate puzzle"}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-3 rounded-md border border-accent-garnet/30 bg-accent-garnet-dim px-2.5 py-2 font-mono text-xs text-accent-garnet-bright">
          {error}
        </div>
      )}
    </div>
  );
}