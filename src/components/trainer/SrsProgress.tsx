"use client";

import { Flame, Target } from "lucide-react";
import { masteryPct, nextReviewLabel } from "@/lib/chess";
import { useTrainer } from "@/lib/trainer/context";

const LEVEL_LABELS = [
  "New",
  "Learning",
  "Learning",
  "Familiar",
  "Familiar",
  "Confident",
  "Confident",
  "Mastered",
  "Mastered",
];

const RADIUS = 30;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function SrsProgress() {
  const { srsState, node, drill } = useTrainer();
  const card = node.srs;
  const level = srsState.level;
  const pct = node.move ? masteryPct(card) : level / srsState.maxLevel;
  const label = LEVEL_LABELS[level] ?? "Learning";
  const dashOffset = CIRCUMFERENCE * (1 - pct);

  return (
    <div className="hidden rounded-xl border border-border-subtle bg-bg-surface p-4">
      {" "}
      <div className="mb-3.5 flex items-baseline justify-between">
        <h3 className="font-serif-display text-[15px] text-text-primary">
          Line mastery
        </h3>
        <span className="font-mono text-[10.5px] tracking-wide text-text-muted">
          {String(level).padStart(2, "0")} /{" "}
          {String(srsState.maxLevel).padStart(2, "0")}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <svg
            width="76"
            height="76"
            viewBox="0 0 76 76"
            className="-rotate-90"
          >
            <circle
              cx="38"
              cy="38"
              r={RADIUS}
              fill="none"
              stroke="var(--color-bg-elevated)"
              strokeWidth="7"
            />
            <circle
              cx="38"
              cy="38"
              r={RADIUS}
              fill="none"
              stroke="var(--color-accent-gold)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              style={{ transition: "stroke-dashoffset 400ms ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-serif-display text-[17px] leading-none text-accent-gold-bright">
              {Math.round(pct * 100)}%
            </span>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] font-medium text-accent-gold-bright">
            {label}
          </p>
          <p className="mt-0.5 text-[11.5px] leading-snug text-text-muted">
            Next review{" "}
            <span className="text-text-secondary">{nextReviewLabel(card)}</span>
          </p>
          {node.srs.lapses > 0 && (
            <p className="mt-0.5 text-[11px] text-accent-garnet-bright">
              {node.srs.lapses} lapse{node.srs.lapses === 1 ? "" : "s"}
            </p>
          )}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border-subtle pt-3.5">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-accent-gold-dim text-accent-gold">
            <Flame className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold leading-tight text-text-primary">
              {drill ? `${drill.correctLines}` : `${srsState.streakDays}`}
            </p>
            <p className="truncate text-[10.5px] text-text-muted">
              {drill ? "held this session" : "session held"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-accent-teal-dim text-accent-teal-bright">
            <Target className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold leading-tight text-text-primary">
              {srsState.accuracyPct}%
            </p>
            <p className="truncate text-[10.5px] text-text-muted">
              chapter accuracy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
