"use client";

import { nagGlyph } from "@/lib/chess";

interface AnnotationNagsProps {
  moveNags: readonly any[];
  currentNags: number[];
  onToggleNag: (code: number) => void;
}

export function AnnotationNags({ moveNags, currentNags, onToggleNag }: AnnotationNagsProps) {
  return (
    <div className="mb-2 flex flex-wrap gap-1">
      {moveNags.map((nag) => (
        <button
          key={nag.code}
          title={nag.label}
          onClick={() => onToggleNag(nag.code)}
          className={[
            "min-w-8 rounded-md border px-2 py-1 font-mono text-[12px] font-semibold transition-colors",
            currentNags.includes(nag.code)
              ? "border-accent-gold/40 bg-accent-gold-dim text-accent-gold-bright"
              : "border-border-default bg-bg-elevated text-text-muted hover:text-text-secondary",
          ].join(" ")}
        >
          {nagGlyph(nag.code)}
        </button>
      ))}
    </div>
  );
}