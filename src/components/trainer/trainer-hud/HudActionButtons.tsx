'use client';
import { useState } from 'react';
import { Download, Keyboard, Upload } from 'lucide-react';
import { PgnDialog } from '../PgnDialog';
import { KeyboardCheatsheet } from './KeyboardCheatsheet';
interface HudActionButtonsProps {
  onImport: () => void;
  onExport: () => void;
  onOpenKeyboard: () => void;
}

export function HudActionButtons() {
  const [pgn, setPgn] = useState<'import' | 'export' | null>(null);
  const [keys, setKeys] = useState(false);
  return (
    <div className="flex gap-2">
      <button
        onClick={() => setPgn('import')}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border-default bg-bg-elevated px-2 py-2 text-[12px] text-text-secondary hover:text-accent-gold-bright">
        <Upload className="h-3.5 w-3.5" />
        Import
      </button>

      <button
        onClick={() => setPgn('export')}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border-default bg-bg-elevated px-2 py-2 text-[12px] text-text-secondary hover:text-accent-gold-bright">
        <Download className="h-3.5 w-3.5" />
        Export
      </button>

      <button
        onClick={() => setKeys(true)}
        className="grid h-9 w-9 place-items-center rounded-lg border border-border-default bg-bg-elevated text-text-muted hover:text-accent-teal-bright"
        aria-label="Keyboard shortcuts">
        <Keyboard className="h-3.5 w-3.5" />
      </button>

      <PgnDialog open={pgn !== null} mode={pgn ?? 'import'} onClose={() => setPgn(null)} />
      <KeyboardCheatsheet open={keys} onClose={() => setKeys(false)} />
    </div>
  );
}
