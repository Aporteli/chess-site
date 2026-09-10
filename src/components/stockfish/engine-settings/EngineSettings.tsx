'use client';

import type { EngineLimits, EngineSettingsState, NnueModel } from '@/lib/chess/use-stockfish';
import { NNUE_OPTIONS } from '@/lib/chess/use-stockfish';
import { SliderRow } from './SliderRow';

interface EngineSettingsProps {
  settings: EngineSettingsState;
  limits: EngineLimits;
  isAnalyzing: boolean;
  depth: number;
  nps: number;
  onChange: (patch: Partial<EngineSettingsState>, restart: boolean) => void;
  enabled: boolean;
  onToggle: () => void;
}

export default function EngineSettings({
  settings,
  limits,
  depth,
  nps,
  onChange,
  enabled,
  onToggle,
}: EngineSettingsProps) {
  const timeSec = settings.searchTimeMs / 1000;

  return (
    <div className="flex flex-col gap-2.5 [&_.engine-range::-webkit-slider-thumb]:appearance-none [&_.engine-range::-webkit-slider-thumb]:h-3.5 [&_.engine-range::-webkit-slider-thumb]:w-3.5 [&_.engine-range::-webkit-slider-thumb]:rounded-full [&_.engine-range::-webkit-slider-thumb]:bg-accent-gold [&_.engine-range::-moz-range-thumb]:h-3.5 [&_.engine-range::-moz-range-thumb]:w-3.5 [&_.engine-range::-moz-range-thumb]:rounded-full [&_.engine-range::-moz-range-thumb]:border-0 [&_.engine-range::-moz-range-thumb]:bg-accent-gold">
      <div className="grid grid-cols-1 gap-2 text-[12px] text-text-secondary sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
        <span>Engine</span>
        <select
          value={settings.nnueModel}
          onChange={(e) => onChange({ nnueModel: e.target.value as NnueModel }, true)}
          className="h-8 min-w-0 w-full rounded-lg border border-border-default bg-bg-elevated px-2 text-[12px] text-text-primary outline-none focus:border-accent-gold/60">
          {NNUE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={onToggle}
          className={`h-8 shrink-0 rounded-md border px-2 font-mono text-[10px] font-semibold transition ${
            enabled
              ? 'border-accent-teal bg-accent-teal-dim text-accent-teal-bright'
              : 'border-border-default bg-bg-elevated text-text-muted'
          }`}>
          {enabled ? 'on' : 'off'}
        </button>
      </div>

      <SliderRow
        label="Search time"
        valueText={`${timeSec % 1 === 0 ? timeSec : timeSec.toFixed(1)}s`}
        min={limits.searchTimeMin}
        max={limits.searchTimeMax}
        step={250}
        value={settings.searchTimeMs}
        onCommit={(n) => onChange({ searchTimeMs: n }, true)}
      />
      <SliderRow
        label="Multiple lines"
        valueText={`${settings.multiPv} / ${limits.multiPvMax}`}
        min={1}
        max={limits.multiPvMax}
        step={1}
        value={settings.multiPv}
        onCommit={(n) => onChange({ multiPv: n }, true)}
      />
      <SliderRow
        label="Threads"
        valueText={`${settings.threads} / ${limits.threadsMax}`}
        min={1}
        max={limits.threadsMax}
        step={1}
        value={settings.threads}
        onCommit={(n) => onChange({ threads: n }, true)}
      />
      <SliderRow
        label="Memory"
        valueText={`${settings.hashMb}MB`}
        min={limits.hashMin}
        max={limits.hashMax}
        step={8}
        value={settings.hashMb}
        onCommit={(n) => onChange({ hashMb: n }, true)}
      />

      <p className="font-mono text-[10px] text-text-muted">
        d{depth || '—'}
        {nps ? ` · ${(nps / 1_000_000).toFixed(2)} Mnps` : ''}
        {` · ${settings.multiPv} line${settings.multiPv === 1 ? '' : 's'}`}
      </p>
    </div>
  );
}
