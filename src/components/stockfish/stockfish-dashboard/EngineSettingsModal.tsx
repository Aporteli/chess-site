"use client";

import { X } from "lucide-react";
import type { EngineLimits, EngineSettingsState } from "@/lib/stockfish/types";
import EngineSettings from "../engine-settings/EngineSettings";

interface EngineSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: EngineSettingsState;
  limits: EngineLimits;
  isAnalyzing: boolean;
  depth: number;
  nps: number;
  onSettingsChange: (patch: Partial<EngineSettingsState>, restart: boolean) => void;
  enabled: boolean;
  onToggleEnabled: () => void;
}

export function EngineSettingsModal({
  isOpen,
  onClose,
  settings,
  limits,
  isAnalyzing,
  depth,
  nps,
  onSettingsChange,
  enabled,
  onToggleEnabled,
}: EngineSettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-border-default bg-bg-surface p-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h4 className="font-serif-display text-[15px] text-text-primary">Engine settings</h4>
          <button
            type="button"
            aria-label="Close settings"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-md text-text-secondary hover:text-text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <EngineSettings
          settings={settings}
          limits={limits}
          isAnalyzing={isAnalyzing}
          depth={depth}
          nps={nps}
          onChange={onSettingsChange}
          enabled={enabled}
          onToggle={onToggleEnabled}
        />
      </div>
    </div>
  );
}