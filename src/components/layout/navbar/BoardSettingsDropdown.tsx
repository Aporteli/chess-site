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
        className="flex h-[35px] shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-[#383838] bg-[#2A2A2A] px-2.5 text-[13px] font-medium text-[#A0A0A0] transition-colors hover:border-[#769656] hover:text-white sm:px-3"
      >
        <SlidersHorizontal className="h-3.5 w-3.5 text-[#769656]" />
      </button>

      {isOpen && <SettingsDropdown onClose={onToggle} />}
    </div>
  );
}