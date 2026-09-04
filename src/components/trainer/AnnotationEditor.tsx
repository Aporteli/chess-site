"use client";

import { EVAL_LABELS, MOVE_NAGS, nagGlyph } from "@/lib/chess";
import { useTrainer } from "@/lib/trainer/context";

export function AnnotationEditor() {
  const t = useTrainer();
  const { node } = t;

  const toggleNag = (code: number) => {
    const nags = node.nags.includes(code)
      ? node.nags.filter((n) => n !== code)
      : [...node.nags, code];
    t.updateCurrent({ nags });
  };

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface p-4">
      <div className="mb-2.5 flex items-baseline justify-between">
        <h3 className="font-serif-display text-[15px] text-text-primary">Annotations</h3>
        {node.move && (
          <span className="font-mono text-[11px] text-accent-gold-bright">{node.move.san}</span>
        )}
      </div>

      <div className="mb-2 flex flex-wrap gap-1">
        {MOVE_NAGS.map((nag) => (
          <button
            key={nag.code}
            title={nag.label}
            onClick={() => toggleNag(nag.code)}
            className={[
              "min-w-8 rounded-md border px-2 py-1 font-mono text-[12px] font-semibold transition-colors",
              node.nags.includes(nag.code)
                ? "border-accent-gold/40 bg-accent-gold-dim text-accent-gold-bright"
                : "border-border-default bg-bg-elevated text-text-muted hover:text-text-secondary",
            ].join(" ")}
          >
            {nagGlyph(nag.code)}
          </button>
        ))}
      </div>

      <div className="mb-2 flex flex-wrap gap-1">
        {EVAL_LABELS.map((ev) => (
          <button
            key={ev.id}
            title={ev.label}
            onClick={() => t.updateCurrent({ eval: node.eval === ev.id ? null : ev.id })}
            className={[
              "rounded-md border px-1.5 py-0.5 font-mono text-[10.5px] transition-colors",
              node.eval === ev.id
                ? "border-accent-teal/40 bg-accent-teal-dim text-accent-teal-bright"
                : "border-border-default bg-bg-elevated text-text-muted hover:text-text-secondary",
            ].join(" ")}
          >
            {ev.glyph}
          </button>
        ))}
      </div>

      <textarea
        value={node.comment}
        onChange={(e) => t.updateCurrent({ comment: e.target.value })}
        placeholder="Commentary on this move…"
        rows={3}
        className="mb-2 w-full resize-none rounded-lg border border-border-default bg-bg-elevated px-2.5 py-2 font-serif-display text-[13px] italic text-text-primary outline-none placeholder:text-text-muted focus:border-accent-gold/40"
      />
      <textarea
        value={node.annotation}
        onChange={(e) => t.updateCurrent({ annotation: e.target.value })}
        placeholder="Pedagogical note (shown as a coach hint)…"
        rows={2}
        className="w-full resize-none rounded-lg border border-border-default bg-bg-elevated px-2.5 py-2 text-[12px] text-text-secondary outline-none placeholder:text-text-muted focus:border-accent-teal/40"
      />

      <div className="mt-2 flex gap-2">
        <button
          onClick={t.promoteCurrent}
          disabled={!node.parentId}
          className="rounded-md border border-border-default px-2 py-1 text-[11px] text-text-secondary hover:border-accent-gold/40 hover:text-accent-gold-bright disabled:opacity-40"
        >
          Promote mainline
        </button>
        <button
          onClick={t.deleteCurrent}
          disabled={!node.parentId}
          className="rounded-md border border-border-default px-2 py-1 text-[11px] text-text-secondary hover:border-accent-garnet/40 hover:text-accent-garnet-bright disabled:opacity-40"
        >
          Delete branch
        </button>
      </div>
    </div>
  );
}
