'use client';

import { useRef } from 'react';
import {
  Camera,
  Lightbulb,
  Volume2,
  VolumeX,
  FlipVertical2,
  RotateCcw,
  Cpu,
} from 'lucide-react';
import { useClickOutside } from '@/hooks/navbar/use-click-outside';
import { performHint, performReset } from '@/lib/chess/board-adapter';
import { useActiveBoardStore } from '@/stores/active-board-store';
import { useSettingsStore } from '@/stores/settings-store';

const menuItemClass =
  'flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-xs text-muted transition-colors hover:bg-elevated hover:text-fg disabled:pointer-events-none disabled:opacity-40';

interface SettingsDropdownProps {
  onClose: () => void;
}

export function SettingsDropdown({ onClose }: SettingsDropdownProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  const sound = useSettingsStore((s) => s.sound);
  const flipped = useSettingsStore((s) => s.flipped);
  const engineEnabled = useSettingsStore((s) => s.engineEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);
  const toggleFlip = useSettingsStore((s) => s.toggleFlip);
  const toggleEngine = useSettingsStore((s) => s.toggleEngine);

  const adapter = useActiveBoardStore((s) => s.adapter);
  const supportsUpload = useActiveBoardStore((s) => s.supportsUpload);
  const openUpload = useActiveBoardStore((s) => s.openUpload);
  const hintDisabled = useActiveBoardStore((s) => s.hintDisabled);
  const resetDisabled = useActiveBoardStore((s) => s.resetDisabled);

  useClickOutside(menuRef as React.RefObject<HTMLElement>, true, onClose);

  const closeAnd = (run: () => void) => () => {
    onClose();
    run();
  };

  return (
    <div ref={menuRef} className="absolute right-0 top-full z-50 mt-1 w-56">
      <div className="flex flex-col gap-0.5 rounded-xl bg-surface p-1.5 shadow-xl ring-1 ring-fg/10">
        {supportsUpload && openUpload && (
          <button
            type="button"
            className={menuItemClass}
            onClick={closeAnd(openUpload)}
          >
            <Camera className="size-4" />
            Add position from FEN
          </button>
        )}

        <button
          type="button"
          className={menuItemClass}
          disabled={!adapter || hintDisabled}
          onClick={closeAnd(() => adapter && performHint(adapter))}
        >
          <Lightbulb className="size-4" />
          Show hint
        </button>

        <button
          type="button"
          className={menuItemClass}
          onClick={closeAnd(toggleSound)}
        >
          {sound ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
          {sound ? 'Mute sounds' : 'Enable sounds'}
        </button>

        <button
          type="button"
          className={menuItemClass}
          onClick={closeAnd(toggleFlip)}
        >
          <FlipVertical2 className="size-4" />
          Flip board
        </button>

        <button
          type="button"
          className={menuItemClass}
          disabled={!adapter || resetDisabled}
          onClick={closeAnd(() => adapter && performReset(adapter))}
        >
          <RotateCcw className="size-4" />
          Restart position
        </button>

        <div className="my-0.5 h-px bg-fg/10" />

        <button
          type="button"
          className={menuItemClass}
          onClick={closeAnd(toggleEngine)}
        >
          <Cpu className="size-4" />
          Engine
          <span
            className={`ml-auto text-2xs font-medium ${
              engineEnabled ? 'text-accent' : 'text-subtle'
            }`}
          >
            {engineEnabled ? 'On' : 'Off'}
          </span>
        </button>
      </div>
    </div>
  );
}