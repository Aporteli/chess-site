"use client";

import { Lightbulb, Eye, Play } from "lucide-react";

interface ToolbarButtonsProps {
  inLine: boolean | null;
  onRequestHint: () => void;
  onRevealSolution: () => void;
  onStartPractice: () => void;
}

export function ToolbarButtons({
  inLine,
  onRequestHint,
  onRevealSolution,
  onStartPractice,
}: ToolbarButtonsProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <button
        onClick={onRequestHint}
        disabled={!inLine}
        className="flex items-center justify-center gap-1.5 rounded-lg border border-border-default bg-bg-elevated px-3 py-2.5 text-[13px] font-medium text-text-secondary transition-colors hover:border-accent-gold/40 hover:text-accent-gold-bright active:scale-[0.98] disabled:opacity-40"
      >
        <Lightbulb className="h-4 w-4" />
        Hint
      </button>
      <button
        onClick={onRevealSolution}
        disabled={!inLine}
        className="flex items-center justify-center gap-1.5 rounded-lg border border-border-default bg-bg-elevated px-3 py-2.5 text-[13px] font-medium text-text-secondary transition-colors hover:border-accent-teal/40 hover:text-accent-teal-bright active:scale-[0.98] disabled:opacity-40"
      >
        <Eye className="h-4 w-4" />
        Solution
      </button>
      <button
        onClick={onStartPractice}
        className="relative flex items-center justify-center gap-1.5 overflow-hidden rounded-lg bg-gradient-to-b from-accent-gold-bright to-accent-gold px-3 py-2.5 text-[13px] font-semibold text-[#241a10] shadow-[0_1px_0_0_rgba(255,255,255,0.35)_inset] transition-transform active:scale-[0.98]"
      >
        <Play className="h-4 w-4" />
        {inLine ? "Restart" : "Practice"}
      </button>
    </div>
  );
}