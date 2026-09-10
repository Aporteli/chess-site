import { formatNags, masteryPct, type TreeNode } from '@/lib/chess';
import { WinPip } from './WinPip';

export function MoveButton({
  node,
  parentFen,
  isActive,
  onJump,
}: {
  node: TreeNode;
  parentFen: string;
  isActive: boolean;
  onJump: (id: string) => void;
}) {
  const pct = masteryPct(node.srs);
  const dotColor =
    node.srs.attempts === 0
      ? 'bg-border-strong'
      : pct > 0.75
        ? 'bg-accent-gold'
        : pct > 0.4
          ? 'bg-accent-teal'
          : 'bg-accent-garnet';

  return (
    <button
      onClick={() => onJump(node.id)}
      className={[
        'inline-flex items-center gap-1.5 rounded px-2 py-0.5 font-mono text-[13px] transition-all',
        isActive
          ? 'bg-accent-teal text-bg-deepest font-bold shadow-sm'
          : 'text-text-primary hover:bg-bg-elevated hover:text-accent-teal-bright',
      ].join(' ')}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      <span>{node.move?.san}</span>
      {formatNags(node.nags) && <span className="text-accent-gold font-sans text-xs">{formatNags(node.nags)}</span>}
      <WinPip fen={parentFen} san={node.move?.san ?? ''} />
    </button>
  );
}
