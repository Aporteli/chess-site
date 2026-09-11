'use client';

import { BookOpen, Dumbbell, Play } from 'lucide-react';
import { useTrainer } from '@/lib/trainer/context';

export function ModeToggle() {
  const { mode, setMode, due } = useTrainer();

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-1 rounded-xl border border-border-subtle bg-bg-surface p-1">
        <button
          onClick={() => setMode('study')}
          className={[
            'flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors',
            mode === 'study'
              ? 'bg-accent-gold-dim text-accent-gold-bright shadow-[0_1px_0_0_rgba(232,197,121,0.15)_inset]'
              : 'text-text-muted hover:text-text-secondary',
          ].join(' ')}>
          <BookOpen className="h-3.5 w-3.5" />
          Study
        </button>
        <button
          onClick={() => setMode('drill')}
          className={[
            'relative flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors',
            mode === 'drill'
              ? 'bg-accent-teal-dim text-accent-teal-bright'
              : 'text-text-muted hover:text-text-secondary',
          ].join(' ')}>
          <Dumbbell className="h-3.5 w-3.5" />
          Drill
          {due.due > 0 && (
            <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent-garnet px-1 font-mono text-[9px] font-semibold text-[#f4ecd8]">
              {due.due}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
