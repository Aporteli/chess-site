'use client';

import { BookOpen, Dumbbell } from 'lucide-react';
import { useTrainer } from '@/lib/trainer/context';

export function ModeToggle() {
  const {
    mode,
    setMode,
    due,
    store,
    repertoire,
    chapter,
    selectChapter,
    selectRepertoire,
  } = useTrainer();

  return (
    <div className="space-y-2">
      {store.repertoires.length > 0 && (
        <label className="block">
          <span className="mb-1 block font-mono text-[11px] text-text-muted">
            Repertoire
          </span>
          <select
            value={repertoire.id}
            onChange={(e) => selectRepertoire(e.target.value)}
            className="w-full rounded-xl border border-border-subtle bg-bg-surface px-3 py-2 text-[13px] text-text-primary outline-none"
          >
            {store.repertoires.map((rep) => (
              <option key={rep.id} value={rep.id}>
                {rep.name}
              </option>
            ))}
          </select>
        </label>
      )}

      <label className="block">
        <span className="mb-1 block font-mono text-[11px] text-text-muted">
          Chapter ({repertoire.chapters.length})
        </span>
        <select
          value={chapter.id}
          onChange={(e) => selectChapter(e.target.value)}
          className="w-full rounded-xl border border-border-subtle bg-bg-surface px-3 py-2 text-[13px] text-text-primary outline-none"
        >
          {repertoire.chapters.map((ch) => (
            <option key={ch.id} value={ch.id}>
              {ch.name}
            </option>
          ))}
        </select>
      </label>

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
