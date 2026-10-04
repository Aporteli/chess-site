'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface MoveHistoryProps {
  moves: string[];
}

export function MoveHistory({ moves }: MoveHistoryProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const latest = moves.length - 1;

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [moves.length]);

  const rows: Array<{ number: number; white: string; black?: string; whiteIndex: number; blackIndex?: number }> = [];
  for (let index = 0; index < moves.length; index += 2) {
    rows.push({
      number: index / 2 + 1,
      white: moves[index] ?? '',
      black: moves[index + 1],
      whiteIndex: index,
      blackIndex: moves[index + 1] ? index + 1 : undefined,
    });
  }

  return (
    <div className="flex min-h-[11rem] flex-1 flex-col overflow-hidden rounded-xl border border-border-default bg-bg-surface shadow-panel">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border-default px-3 py-2">
        <h2 className="font-mono text-[10px] uppercase tracking-wider text-text-muted">Score sheet</h2>
        <span className="font-mono text-[11px] tabular-nums text-text-secondary">
          {moves.length === 0 ? 'No moves' : `Move ${Math.ceil(moves.length / 2)}`}
        </span>
      </div>

      <div ref={scrollerRef} className="thin-scrollbar min-h-0 flex-1 overflow-y-auto">
        {moves.length === 0 ? (
          <p className="px-3 py-4 font-mono text-xs italic text-text-muted">White moves first. The score will fill in here.</p>
        ) : (
          <table className="w-full border-collapse font-mono text-xs">
            <thead className="sticky top-0 bg-bg-surface">
              <tr className="text-left text-[10px] uppercase tracking-wider text-text-muted">
                <th className="w-10 px-3 py-1.5 font-normal">#</th>
                <th className="px-2 py-1.5 font-normal">White</th>
                <th className="px-2 py-1.5 font-normal">Black</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.number} className="border-t border-white/5 odd:bg-white/[0.02]">
                  <td className="px-3 py-1 tabular-nums text-text-muted">{row.number}</td>
                  <td className="px-2 py-1">
                    <MoveCell san={row.white} active={row.whiteIndex === latest} />
                  </td>
                  <td className="px-2 py-1">
                    {row.black ? <MoveCell san={row.black} active={row.blackIndex === latest} /> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function MoveCell({ san, active }: { san: string; active: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex min-w-10 rounded px-1.5 py-0.5',
        active ? 'bg-accent-teal-bright/20 text-accent-gold-bright' : 'text-text-secondary',
      )}>
      {san}
    </span>
  );
}
