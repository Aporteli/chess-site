import { useEffect, useState } from 'react';
import { formatNags, masteryPct, type TreeNode } from '@/lib/chess';
import { WinPip } from './WinPip';

export function MoveButton({
  node,
  parentFen,
  isActive,
  onJump,
  onDelete,
}: {
  node: TreeNode;
  parentFen: string;
  isActive: boolean;
  onJump: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [menu]);

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
    <>
    <button
    type="button"
    onClick={() => onJump(node.id)}
    onContextMenu={(e) => {
      e.preventDefault();
      setMenu({ x: e.clientX, y: e.clientY });
    }}
      className={[
        'group relative flex w-full items-center gap-1.5 rounded-md',
        'px-2 py-1.5 font-mono text-[13px] leading-none',
        'transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/55',
        'focus-visible:ring-offset-1 focus-visible:ring-offset-bg-deepest',
        isActive
          ? 'bg-accent-teal/12 font-bold text-accent-teal-bright ring-1 ring-inset ring-accent-teal/25'
          : 'text-text-primary hover:bg-bg-elevated-hover',
      ].join(' ')}
    >
      {/* აქტიური მდგომარეობის მარცხენა აქცენტური ზოლი (Linear-სტილი) */}
      <span
        aria-hidden="true"
        className={[
          'absolute inset-y-1 left-0 w-[2px] rounded-full bg-accent-teal',
          'origin-center',
          isActive ? 'scale-y-100' : 'scale-y-0',
        ].join(' ')}
      />

      {/* Mastery dot — ოდნავ დაშორებული, რომ ზოლი არ დაემთხვეს */}
      <span
        className={[
          'ml-1 h-1.5 w-1.5 shrink-0 rounded-full transition-shadow',
          dotColor,
          isActive ? 'ring-1 ring-bg-deepest/50' : '',
        ].join(' ')}
      />

      <span className="truncate">{node.move?.san}</span>

      {formatNags(node.nags) && (
        <span className="font-sans text-xs text-accent-gold">
          {formatNags(node.nags)}
        </span>
      )}

      {/* WinPip მარჯვნივ — ვიზუალური იერარქია ემთხვევა MoveHistory-ს */}
      <span className="ml-auto flex shrink-0 items-center">
        <WinPip fen={parentFen} san={node.move?.san ?? ''} />
      </span>
    </button>
    {menu && (
        <div
          role="menu"
          className="fixed z-50 min-w-[8rem] rounded-md border border-border-subtle bg-bg-surface py-1 shadow-lg"
          style={{ left: menu.x, top: menu.y }}
        >
          <button
            type="button"
            role="menuitem"
            className="w-full px-3 py-1.5 text-left text-sm text-text-primary hover:bg-bg-elevated-hover"
            onClick={() => {
              onDelete(node.id);
              setMenu(null);
            }}
          >
            Delete
          </button>
        </div>
      )}
    </>
  );
}