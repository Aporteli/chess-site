'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const ROWS = [
  ['← → / wheel', 'Step through the line'],
  ['↑ ↓ / Home End', 'Start or end of the chapter'],
  ['F', 'Flip the board'],
  ['H', 'Hint (drill)'],
  ['Enter', 'Next line / solution'],
  ['Esc', 'Clear arrows, highlights, selection'],
  ['S', 'Toggle sound'],
  ['1–6', 'NAG ! ? !! ?? !? ?! (study)'],
  ['Right-drag', 'Draw arrows (Shift / Ctrl recolor)'],
  ['Right-click', 'Highlight a square'],
];

export function KeyboardCheatsheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);

  // Portal მხოლოდ კლიენტზე, SSR-ის დროს document არ არსებობს
  useEffect(() => {
    setMounted(true);
  }, []);

  // Escape-ით დახურვა (სურვილისამებრ, მაგრამ კარგი პრაქტიკაა)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border-default bg-bg-surface p-5 shadow-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-mono text-[18px] text-text-primary">Board ergonomics</h2>
        <p className="mt-1 text-[12px] text-text-muted">
          Built for long study sessions — keep your hands on the keyboard.
        </p>
        <dl className="mt-4 space-y-1.5">
          {ROWS.map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-3 text-[13px]">
              <dt className="font-mono text-[11px] text-accent-gold-bright">{k}</dt>
              <dd className="text-right text-text-secondary">{v}</dd>
            </div>
          ))}
        </dl>
        <button
          onClick={onClose}
          className="mt-4 w-full rounded-lg border border-border-default py-2 text-[13px] text-text-secondary hover:text-text-primary"
        >
          Close
        </button>
      </div>
    </div>,
    document.body,
  );
}