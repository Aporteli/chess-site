"use client";

import { EVAL_LABELS, MOVE_NAGS } from "@/lib/chess";
import { useTrainer } from "@/lib/trainer/context";
import { AnnotationHeader } from "./AnnotationHeader";
import { AnnotationNags } from "./AnnotationNags";
import { AnnotationEvals } from "./AnnotationEvals";
import { AnnotationActions } from "./AnnotationActions";

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
    <div className="hidden rounded-xl border border-border-subtle bg-bg-surface p-4">
      <AnnotationHeader moveSan={node.move?.san} />

      <AnnotationNags
        moveNags={MOVE_NAGS}
        currentNags={node.nags}
        onToggleNag={toggleNag}
      />

      <AnnotationEvals
        evalLabels={EVAL_LABELS}
        currentEval={node.eval}
        onSelectEval={(evId) => t.updateCurrent({ eval: node.eval === evId ? null : (evId as any) })}      />

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

      <AnnotationActions
        hasParent={Boolean(node.parentId)}
        onPromote={t.promoteCurrent}
        onDelete={t.deleteCurrent}
      />
    </div>
  );
}