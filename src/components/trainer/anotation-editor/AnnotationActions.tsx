"use client";

interface AnnotationActionsProps {
  hasParent: boolean;
  onPromote: () => void;
  onDelete: () => void;
}

export function AnnotationActions({ hasParent, onPromote, onDelete }: AnnotationActionsProps) {
  return (
    <div className="mt-2 flex gap-2">
      <button
        onClick={onPromote}
        disabled={!hasParent}
        className="rounded-md border border-border-default px-2 py-1 text-[11px] text-text-secondary hover:border-accent-gold/40 hover:text-accent-gold-bright disabled:opacity-40"
      >
        Promote mainline
      </button>
      <button
        onClick={onDelete}
        disabled={!hasParent}
        className="rounded-md border border-border-default px-2 py-1 text-[11px] text-text-secondary hover:border-accent-garnet/40 hover:text-accent-garnet-bright disabled:opacity-40"
      >
        Delete branch
      </button>
    </div>
  );
}