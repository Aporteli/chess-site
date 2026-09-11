"use client";

interface AnalysisMetaProps {
  loading: boolean;
  category?: string;
  hasLocalLine: boolean;
  evalText: string;
  dtz?: number | null;
}

export function AnalysisMeta({ loading, category, hasLocalLine, evalText, dtz }: AnalysisMetaProps) {
  return (
    <div className="flex items-center justify-between font-mono text-micro text-muted flex-shrink-0">
      <span className="uppercase tracking-wider text-accent">
        {loading ? "…" : (category ?? (hasLocalLine ? "local" : "idle"))}
      </span>
      {/* <span className="tabular-nums">
        {evalText}
        {dtz != null ? ` · DTZ ${dtz}` : ""}
      </span> */}
    </div>
  );
}