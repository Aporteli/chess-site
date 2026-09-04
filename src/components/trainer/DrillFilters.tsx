"use client";

import type { DrillFilter } from "@/lib/chess";
import { useTrainer } from "@/lib/trainer/context";

const FILTERS: { id: DrillFilter; label: string; hint: string }[] = [
  { id: "due", label: "Due", hint: "Overdue SRS cards" },
  { id: "weak", label: "Weak", hint: "Lapses and low accuracy" },
  { id: "new", label: "New", hint: "Never reviewed" },
  { id: "chapter", label: "Chapter", hint: "Every move in this file" },
  { id: "repertoire", label: "All files", hint: "Whole repertoire" },
  { id: "blunders", label: "Traps", hint: "?? / ? branches" },
];

export function DrillFilters() {
  const { drill, setFilter, due } = useTrainer();
  const active = drill?.filter ?? "due";
  const counts: Record<DrillFilter, number> = {
    due: due.due,
    weak: due.weak,
    new: due.fresh,
    chapter: due.chapter,
    repertoire: due.repertoire,
    blunders: due.blunders,
  };

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface p-3">
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="font-serif-display text-[15px] text-text-primary">Queue</h3>
        {drill && (
          <span className="font-mono text-[10.5px] text-text-muted">
            {Math.min(drill.index + (drill.lineComplete ? 0 : 1), drill.queue.length)} /{" "}
            {drill.queue.length}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            title={f.hint}
            onClick={() => setFilter(f.id)}
            className={[
              "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
              active === f.id
                ? "border-accent-teal/40 bg-accent-teal-dim text-accent-teal-bright"
                : "border-border-default bg-bg-elevated text-text-muted hover:text-text-secondary",
            ].join(" ")}
          >
            {f.label}
            <span className="ml-1 font-mono opacity-70">{counts[f.id]}</span>
          </button>
        ))}
      </div>
      {drill?.sessionOver && (
        <p className="mt-2 text-[11.5px] text-text-muted">
          Queue empty — pick another filter or return to study.
        </p>
      )}
    </div>
  );
}
