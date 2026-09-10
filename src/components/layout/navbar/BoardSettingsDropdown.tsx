import React from "react";
import { SlidersHorizontal } from "lucide-react";
import { useTrainerOptional } from "@/lib/trainer/context";

interface BoardSettingsDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
}

const SETTINGS_OPTIONS = [
  { key: "sound", label: "Sounds" },
  { key: "legalHints", label: "Legal hints" },
  { key: "animations", label: "Animations" },
  { key: "coordinates", label: "Coordinates" },
] as const;

export function BoardSettingsDropdown({ isOpen, onToggle }: BoardSettingsDropdownProps) {
  const trainer = useTrainerOptional();
  if (!trainer) return null;

  return (
    <div className="relative">
      <button
        aria-label="Board settings"
        onClick={onToggle}
        className="hidden shrink-0 items-center gap-2 rounded-lg border border-border-default bg-bg-elevated px-3 py-1.5 text-[13px] font-medium text-text-secondary transition-colors hover:border-accent-teal/40 hover:text-text-primary sm:flex"
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Board
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-40 mt-2 w-56 rounded-xl border border-border-default bg-bg-surface p-3 shadow-panel">
          {SETTINGS_OPTIONS.map(({ key, label }) => (
            <label key={key} className="flex items-center justify-between py-1 text-[12.5px] text-text-secondary">
              {label}
              <input
                type="checkbox"
                className="accent-[#c9a256]"
                checked={trainer.settings[key]}
                onChange={(e) => trainer.setSettings({ [key]: e.target.checked })}
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
}