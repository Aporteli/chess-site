'use client';

import { SlidersHorizontal } from 'lucide-react';
import { SettingsDropdown } from './SettingsDropdown';

interface BoardSettingsDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function BoardSettingsDropdown({
  isOpen,
  onToggle,
}: BoardSettingsDropdownProps) {
  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Board settings"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="hidden shrink-0 items-center gap-2 rounded-lg border border-border-default bg-bg-elevated px-3 py-1.5 text-[13px] font-medium text-text-secondary transition-colors hover:border-accent-teal/40 hover:text-text-primary sm:flex"
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Board
      </button>

      {isOpen && <SettingsDropdown onClose={onToggle} />}
    </div>
  );
}