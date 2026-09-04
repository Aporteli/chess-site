"use client";

import {
  Lightbulb,
  Eye,
  Play,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import { useTrainer } from "@/lib/trainer/context";

export function ActionToolbar() {
  const t = useTrainer();
  const drilling = t.mode === "drill";
  const inLine = drilling && t.drill && !t.drill.lineComplete;

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface p-3">
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={t.requestHint}
          disabled={!inLine}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-border-default bg-bg-elevated px-3 py-2.5 text-[13px] font-medium text-text-secondary transition-colors hover:border-accent-gold/40 hover:text-accent-gold-bright active:scale-[0.98] disabled:opacity-40"
        >
          <Lightbulb className="h-4 w-4" />
          Hint
        </button>
        <button
          onClick={t.revealSolution}
          disabled={!inLine}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-border-default bg-bg-elevated px-3 py-2.5 text-[13px] font-medium text-text-secondary transition-colors hover:border-accent-teal/40 hover:text-accent-teal-bright active:scale-[0.98] disabled:opacity-40"
        >
          <Eye className="h-4 w-4" />
          Solution
        </button>
        <button
          onClick={() => t.startPractice()}
          className="relative flex items-center justify-center gap-1.5 overflow-hidden rounded-lg bg-gradient-to-b from-accent-gold-bright to-accent-gold px-3 py-2.5 text-[13px] font-semibold text-[#241a10] shadow-[0_1px_0_0_rgba(255,255,255,0.35)_inset] transition-transform active:scale-[0.98]"
        >
          <Play className="h-4 w-4" />
          {inLine ? "Restart" : "Practice"}
        </button>
      </div>

      <div className="mt-3 flex items-center justify-center gap-0.5 rounded-lg border border-border-subtle bg-bg-elevated/60 p-1">
        {[
          { icon: ChevronsLeft, label: "Go to start", run: t.goStart },
          { icon: ChevronLeft, label: "Previous move", run: t.goBack },
          { icon: ChevronRight, label: "Next move", run: t.goForward },
          { icon: ChevronsRight, label: "Go to end", run: t.goEnd },
        ].map(({ icon: Icon, label, run }) => (
          <button
            key={label}
            aria-label={label}
            onClick={run}
            className="grid h-9 flex-1 place-items-center rounded-md text-text-muted transition-colors hover:bg-bg-elevated-hover hover:text-accent-gold-bright active:scale-95"
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
      </div>
    </div>
  );
}
