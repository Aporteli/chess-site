'use client';

import { Download, Keyboard, Upload } from 'lucide-react';

interface HudActionButtonsProps {
  onImport: () => void;
  onExport: () => void;
  onOpenKeyboard: () => void;
}

export function HudActionButtons({ onImport, onExport, onOpenKeyboard }: HudActionButtonsProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={onImport}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border-default bg-bg-elevated px-2 py-2 text-[12px] text-text-secondary hover:text-accent-gold-bright">
        <Upload className="h-3.5 w-3.5" />
        Import
      </button>

      <button
        onClick={onExport}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border-default bg-bg-elevated px-2 py-2 text-[12px] text-text-secondary hover:text-accent-gold-bright">
        <Download className="h-3.5 w-3.5" />
        Export
      </button>

      <button
        onClick={onOpenKeyboard}
        className="grid h-9 w-9 place-items-center rounded-lg border border-border-default bg-bg-elevated text-text-muted hover:text-accent-teal-bright"
        aria-label="Keyboard shortcuts">
        <Keyboard className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
