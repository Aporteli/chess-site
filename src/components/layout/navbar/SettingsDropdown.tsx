import React from 'react';
import { Camera, Lightbulb, Volume2, VolumeX, FlipVertical2, RotateCcw, Cpu } from 'lucide-react';
import { useTablebaseStore } from '@/stores/tablebase-store';
import { useRef, useState, RefObject } from 'react';
import { useClickOutside } from '@/hooks/navbar/use-click-outside';
import { handleHint, handleReset } from '@/lib/tablebase/chess/play';
import { fenTurn } from '@/lib/tablebase/chess/moves';

const menuItemClass =
  'flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-xs text-muted transition-colors hover:bg-elevated hover:text-fg disabled:pointer-events-none disabled:opacity-40';

export function SettingsDropdown() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const fen = useTablebaseStore((s) => s.fen);
  const sound = useTablebaseStore((s) => s.sound);
  const building = useTablebaseStore((s) => s.pipeline !== 'idle');
  const gameOver = useTablebaseStore((s) => s.gameOver);
  const flipped = useTablebaseStore((s) => s.flipped);
  const setUploadOpen = useTablebaseStore((s) => s.setUploadOpen);
  const toggleSound = useTablebaseStore((s) => s.toggleSound);
  const toggleFlip = useTablebaseStore((s) => s.toggleFlip);
  const enabled = useTablebaseStore((s) => s.engineEnabled);
  const onToggleEngine = useTablebaseStore((s) => s.toggleEngine);

  useClickOutside(menuRef as RefObject<HTMLElement>, open, () => setOpen(false));

  const turn = fenTurn(fen);
  const human = flipped ? 'b' : 'w';
  const hintDisabled = building || !!gameOver || turn !== human;

  const closeAnd = (run: () => void) => () => {
    setOpen(false);
    run();
  };
  return (
    <div>
      <div className="absolute right-0 top-full z-50 mt-1 w-56">
        <div className="flex flex-col gap-0.5 rounded-xl bg-surface p-1.5 shadow-xl ring-1 ring-fg/10">
          <button
            type="button"
            className={menuItemClass}
            disabled={building}
            onClick={closeAnd(() => setUploadOpen(true))}>
            <Camera className="size-4" />
            Add position from FEN
          </button>

          <button type="button" className={menuItemClass} disabled={hintDisabled} onClick={closeAnd(handleHint)}>
            <Lightbulb className="size-4" />
            Show hint
          </button>

          <button type="button" className={menuItemClass} onClick={closeAnd(toggleSound)}>
            {sound ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
            {sound ? 'Mute sounds' : 'Enable sounds'}
          </button>

          <button type="button" className={menuItemClass} onClick={closeAnd(toggleFlip)}>
            <FlipVertical2 className="size-4" />
            Flip board
          </button>

          <button type="button" className={menuItemClass} onClick={closeAnd(handleReset)}>
            <RotateCcw className="size-4" />
            Restart position
          </button>

          <div className="my-0.5 h-px bg-fg/10" />

          <button type="button" className={menuItemClass} onClick={closeAnd(onToggleEngine)}>
            <Cpu className="size-4" />
            Engine
            <span className={`ml-auto text-2xs font-medium ${enabled ? 'text-accent' : 'text-subtle'}`}>
              {enabled ? 'On' : 'Off'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
