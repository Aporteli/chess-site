import type { TreeNode } from "@/lib/chess";

/**
 * Horizontal row of alternative (non-mainline) moves at one position,
 * e.g. "or White: c3 d3 …" — reused for both colors.
 */
export function SiblingRow({
  label,
  siblings,
  onJump,
}: {
  label: string;
  siblings: TreeNode[];
  onJump: (id: string) => void;
}) {
  if (siblings.length === 0) return null;

  return (
    <div className="mt-1 ml-8 flex flex-wrap items-center gap-1.5 border-t border-border-subtle/30 pt-1">
      <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
        {label}:
      </span>
      {siblings.map((alt) => (
        <button
          key={alt.id}
          onClick={() => onJump(alt.id)}
          className="rounded bg-bg-surface px-1.5 py-0.5 font-mono text-xs text-text-secondary hover:text-accent-teal hover:border-accent-teal/50 border border-border-subtle transition-colors"
        >
          {alt.move?.san}
        </button>
      ))}
    </div>
  );
}