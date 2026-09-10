"use client";

import { useMemo } from "react";
import { Lightbulb } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { usePuzzleStore } from "@/stores/puzzle-store";
import { cn } from "@/lib/utils";

function getStatusStyle(status: string | null) {
  if (status === "Solved") {
    return "border-accent-teal/40 bg-accent-teal-dim text-accent-teal-bright";
  }
  if (status === "Off the solution line") {
    return "border-accent-garnet/40 bg-accent-garnet-dim text-accent-garnet-bright";
  }
  if (status) {
    return "border-accent-gold/40 bg-accent-gold-dim text-accent-gold-bright";
  }
  return "border-border-subtle bg-bg-elevated text-text-muted";
}

export function StatusPanel() {
  const { puzzle, status, hintLevel, setHintLevel } = usePuzzleStore(
    useShallow((state) => ({
      puzzle: state.puzzle,
      status: state.status,
      hintLevel: state.hintLevel,
      setHintLevel: state.setHintLevel,
    }))
  );

  const rating = puzzle?.rating ?? 0;
  const theme = puzzle?.theme ?? "";
  const statusTone = getStatusStyle(status);

  const { hintFrom, hintTo, hintAvailable } = useMemo(() => {
    const available = Boolean(puzzle && puzzle.solution && puzzle.solution.length > 0);
    const nextMove = puzzle?.solution?.[0] ?? "";
    return {
      hintAvailable: available,
      hintFrom: nextMove.slice(0, 2),
      hintTo: nextMove.slice(2, 4),
    };
  }, [puzzle]);

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface p-4 shadow-panel">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
            Status
          </p>
          <p
            className={cn(
              "mt-1 inline-flex rounded-md border px-2 py-0.5 font-mono text-xs",
              statusTone
            )}
          >
            {status ?? (puzzle ? "Your move" : "Waiting")}
          </p>
        </div>

        {puzzle && (
          <div className="text-right">
            <p className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
              Rating
            </p>
            <p className="mt-0.5 font-serif text-2xl text-accent-gold-bright">
              {rating}
            </p>
          </div>
        )}
      </div>

      {puzzle && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {theme && (
            <span className="rounded-md border border-accent-teal/30 bg-accent-teal-dim px-2 py-0.5 font-mono text-[11px] text-accent-teal-bright">
              {theme}
            </span>
          )}

          <button
            type="button"
            disabled={!hintAvailable || hintLevel >= 2}
            onClick={() => setHintLevel(Math.min(hintLevel + 1, 2))}
            className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-border-default bg-bg-elevated px-2.5 py-1.5 font-mono text-xs text-text-secondary transition hover:border-accent-gold/50 hover:text-accent-gold-bright disabled:opacity-40"
          >
            <Lightbulb className="h-3.5 w-3.5" />
            Hint
          </button>

          {hintLevel >= 1 && hintFrom && (
            <span className="font-mono text-xs text-text-muted">
              {hintLevel === 1 ? `from ${hintFrom}` : `${hintFrom} → ${hintTo}`}
            </span>
          )}
        </div>
      )}
    </div>
  );
}