"use client";

import { Lightbulb } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { usePuzzleStore } from "@/stores/puzzle-store";
import { cn } from "@/lib/utils";

export function StatusPanel() {
  // 1. გამოიყენე useShallow, რომ თავიდან აირიდო უსასრულო რენდერი
  const { puzzle, status, hintLevel, setHintLevel } = usePuzzleStore(
    useShallow((state) => ({
      puzzle: state.puzzle,
      status: state.status,
      hintLevel: state.hintLevel,
      setHintLevel: state.setHintLevel,
    }))
  );

  // 2. ცვლადების ერთხელ განსაზღვრა (Fallbacks)
  const rating = puzzle?.rating ?? 0;
  const theme = puzzle?.theme ?? "";

  const statusTone =
    status === "Solved"
      ? "border-accent-teal/40 bg-accent-teal-dim text-accent-teal-bright"
      : status === "Off the solution line"
      ? "border-accent-garnet/40 bg-accent-garnet-dim text-accent-garnet-bright"
      : status
      ? "border-accent-gold/40 bg-accent-gold-dim text-accent-gold-bright"
      : "border-border-subtle bg-bg-elevated text-text-muted";

  const hintAvailable = Boolean(puzzle && puzzle.solution && puzzle.solution.length > 0);

  // 3. მინიშნების სვლის უსაფრთხოდ ამოღება (მაგალითად: ["e2e4", ...])
  const nextMove = puzzle?.solution?.[0] ?? "";
  const hintFrom = nextMove.slice(0, 2); // "e2"
  const hintTo = nextMove.slice(2, 4);   // "e4"

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
            onClick={() => setHintLevel(Math.min(hintLevel + 1, 2))} // შეზღუდვა მაქსიმუმ level 2-მდე
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