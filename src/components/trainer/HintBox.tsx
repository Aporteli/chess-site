"use client";

import { useTrainer } from "@/lib/trainer/context";

const KIND_STYLES = {
  question: { border: "border-accent-gold/25", bg: "bg-bg-surface", text: "text-text-primary", mark: "text-accent-gold/25" },
  success: { border: "border-accent-gold/30", bg: "bg-accent-gold-dim", text: "text-accent-gold-bright", mark: "text-accent-gold/30" },
  error: { border: "border-accent-garnet/30", bg: "bg-accent-garnet-dim", text: "text-accent-garnet-bright", mark: "text-accent-garnet/30" },
  info: { border: "border-accent-teal/30", bg: "bg-accent-teal-dim", text: "text-accent-teal-bright", mark: "text-accent-teal/30" },
} as const;

export function HintBox() {
  const { prompt, node } = useTrainer();
  const style = KIND_STYLES[prompt.kind];

  return (
    <div
      className={[
        "relative overflow-hidden rounded-xl border-l-2 border-y border-r p-4 pl-5",
        style.border,
        style.bg,
      ].join(" ")}
    >
      <span
        aria-hidden
        className={["font-serif-display absolute -top-3 right-3 text-[64px] leading-none", style.mark].join(" ")}
      >
        “
      </span>
      <p className={["relative font-serif-display text-[15px] italic leading-relaxed", style.text].join(" ")}>
        {prompt.text}
      </p>
      {node.annotation && prompt.kind !== "error" && node.comment && (
        <p className="relative mt-2 text-[12px] leading-relaxed text-text-secondary">
          {node.annotation}
        </p>
      )}
      <p className="relative mt-2 text-[11.5px] text-text-muted">— your coach</p>
    </div>
  );
}
