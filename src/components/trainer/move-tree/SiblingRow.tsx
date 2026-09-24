import type { TreeNode } from "@/lib/chess";

/**
 * Horizontal row of alternative (non-mainline) moves at one position,
 * e.g. "or White: c3 d3 …" — reused for both colors.
 */
export function SiblingRow({
  label,
  siblings,
  onJump,
  onDelete,
}: {
  label: string;
  siblings: TreeNode[];
  onJump: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  if (siblings.length === 0) return null;

  return (
    <div className="mt-1 ml-6 flex min-w-0 items-center overflow-hidden rounded bg-bg-deepest">
      <span className="shrink-0 px-2 py-1 text-xs text-text-muted">{label}</span>
      <div className="flex min-w-0 flex-1 flex-wrap">
        {siblings.map((alt) => (
          <button
            key={alt.id}
            onClick={() => onJump(alt.id)}
            className="px-2 py-1 font-mono text-[13px] text-text-primary hover:bg-bg-elevated transition-colors"
          >
            {alt.move?.san}
          </button>
        ))}
      </div>
    </div>
  );
}