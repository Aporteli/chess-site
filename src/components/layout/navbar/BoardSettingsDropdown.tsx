import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useTrainerOptional } from '@/lib/trainer/context';
import { SettingsDropdown } from './SettingsDropdown';

interface BoardSettingsDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
}

const SETTINGS_OPTIONS = [
  { key: 'sound', label: 'Sounds' },
  { key: 'legalHints', label: 'Legal hints' },
  { key: 'animations', label: 'Animations' },
  { key: 'coordinates', label: 'Coordinates' },
] as const;

export function BoardSettingsDropdown({ isOpen, onToggle }: BoardSettingsDropdownProps) {
  const trainer = useTrainerOptional();
  if (!trainer) return null;

  return (
    <div className="relative">
      <button
        aria-label="Board settings"
        onClick={onToggle}
        className="hidden shrink-0 items-center gap-2 rounded-lg border border-border-default bg-bg-elevated px-3 py-1.5 text-[13px] font-medium text-text-secondary transition-colors hover:border-accent-teal/40 hover:text-text-primary sm:flex">
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Board
      </button>

      {isOpen && <SettingsDropdown />}
    </div>
  );
}
