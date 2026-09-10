'use client';

import { useTrainer } from '@/lib/trainer/context';

export function OpeningHeaderCard() {
  const { openingMeta } = useTrainer();
  return (
    <div className="hidden relative overflow-hidden rounded-xl border border-border-subtle bg-bg-surface p-4">
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-accent-gold/70 via-accent-gold-bright to-accent-gold/70" />
      <div className="mb-2.5 flex items-center gap-2">
        <span className="rounded-md border border-accent-gold/25 bg-accent-gold-dim px-2 py-0.5 font-mono text-[11px] font-medium text-accent-gold-bright">
          {openingMeta.eco || 'ECO'}
        </span>
        <span
          className={[
            'rounded-md border px-2 py-0.5 text-[11px] font-medium',
            openingMeta.side === 'white'
              ? 'border-border-default bg-bg-elevated text-text-primary'
              : 'border-border-strong bg-bg-deepest text-text-secondary',
          ].join(' ')}>
          {openingMeta.side === 'white' ? 'White repertoire' : 'Black repertoire'}
        </span>
      </div>
      <h2 className="font-serif-display text-[20px] font-medium leading-snug text-text-primary">{openingMeta.name}</h2>
      <p className="mt-0.5 text-[13px] text-text-secondary">{openingMeta.variation}</p>
    </div>
  );
}
