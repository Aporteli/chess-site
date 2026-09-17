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
    <div className="flex items-center justify-between font-mono text-xs text-[#A0A0A0] flex-shrink-0">
      <span className="uppercase tracking-wider text-[#769656] font-semibold">
        {loading ? "…" : (category ?? (hasLocalLine ? "local" : "idle"))}
      </span>
      {/* <span className="tabular-nums">
        {evalText}
        {dtz != null ? ` · DTZ ${dtz}` : ""}
      </span> */}
    </div>
  );
}