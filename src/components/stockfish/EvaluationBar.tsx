"use client";

interface EvaluationBarProps {
  evaluation?: number | null;
  score?: number | null;
  variant?: "board" | "panel";
}

export function EvaluationBar({ evaluation, score, variant = "board" }: EvaluationBarProps) {
  const evalScore = (score ?? evaluation) ?? 0;
  const clampedEval = Math.max(-10, Math.min(10, evalScore));
  const whiteBarHeight = Math.round(((clampedEval + 10) / 20) * 100);

  if (variant === "panel") {
    return (
      <div className="relative h-2 w-full overflow-hidden rounded-full border border-border-subtle bg-bg-deepest">
        <div
          className="h-full bg-text-primary"
          style={{ width: `${whiteBarHeight}%` }}
        />
      </div>
    );
  }

  return (
    <div className="flex h-full w-3.5 shrink-0 flex-col justify-end overflow-hidden rounded-full border border-accent-gold/50 bg-bg-deepest shadow-lg">
      <div
        className="w-full bg-text-primary transition-all duration-300"
        style={{ height: `${whiteBarHeight}%` }}
      />
    </div>
  );
}

export default EvaluationBar;