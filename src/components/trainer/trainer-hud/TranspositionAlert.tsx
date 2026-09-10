"use client";

import { GitMerge } from "lucide-react";
import { useTrainer } from "@/lib/trainer/context";

export function TranspositionAlert() {
  const t = useTrainer();
  if (!t.transpositions.length) return null;

  return (
    <div className="rounded-xl border border-accent-teal/30 bg-accent-teal-dim p-3">
      <div className="mb-1.5 flex items-center gap-1.5 text-[12px] font-medium text-accent-teal-bright">
        <GitMerge className="h-3.5 w-3.5" />
        Transposition
      </div>
      <p className="mb-2 text-[12px] leading-relaxed text-text-secondary">
        This position is already in the repertoire via another move order.
      </p>
      <ul className="space-y-1">
        {t.transpositions.slice(0, 4).map((hit) => (
          <li key={`${hit.chapterId}-${hit.nodeId}`}>
            <button
              onClick={() => t.openLocation(hit.chapterId, hit.nodeId)}
              className="text-left font-mono text-[11.5px] text-accent-teal-bright hover:underline"
            >
              {hit.chapterName}: {hit.line}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
