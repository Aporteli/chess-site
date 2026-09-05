"use client";

import type { EngineLimits, EngineSettingsState } from "@/lib/chess/use-stockfish";

type EngineSettingsProps = {
  settings: EngineSettingsState;
  limits: EngineLimits;
  isAnalyzing: boolean;
  depth: number;
  nps: number;
  onChange: (patch: Partial<EngineSettingsState>, restart: boolean) => void;
};

function SliderRow({
  label,
  valueText,
  min,
  max,
  step,
  value,
  onCommit,
}: {
  label: string;
  valueText: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onCommit: (n: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <label className="grid grid-cols-[7.5rem_1fr_4.25rem] items-center gap-2 text-[12px] text-text-secondary">
      <span>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onCommit(Number(e.target.value))}
        className="engine-range h-1.5 w-full cursor-pointer appearance-none rounded-full"
        style={{
          background: `linear-gradient(to right, var(--color-accent-gold, #c9a256) ${pct}%, var(--color-border-default, #3a3122) ${pct}%)`,
        }}
      />
      <span className="text-right font-mono text-[11px] text-text-primary">{valueText}</span>
    </label>
  );
}

export default function EngineSettings({
  settings,
  limits,
  isAnalyzing,
  depth,
  nps,
  onChange,
}: EngineSettingsProps) {
  const timeSec = settings.searchTimeMs / 1000;
  return (
    <div className="flex flex-col gap-2.5">
      <style>{`
        .engine-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 999px;
          background: var(--color-accent-gold, #c9a256);
          border: 0;
          cursor: pointer;
        }
        .engine-range::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 999px;
          background: var(--color-accent-gold, #c9a256);
          border: 0;
          cursor: pointer;
        }
      `}</style>

      <div className="grid grid-cols-[7.5rem_1fr_4.25rem] items-center gap-2 text-[12px] text-text-secondary">
        <span>Engine</span>
        <div className="flex h-8 items-center justify-between rounded-lg border border-border-default bg-bg-elevated px-2.5 text-[12px] text-text-primary">
          <span className="truncate">Stockfish WASM</span>
          <span className="text-text-muted">▾</span>
        </div>
        <span className="text-right font-mono text-[10px] text-text-muted">
          {isAnalyzing ? "on" : "off"}
        </span>
      </div>

      <SliderRow
        label="Search time"
        valueText={`${timeSec % 1 === 0 ? timeSec : timeSec.toFixed(1)}s`}
        min={limits.searchTimeMin}
        max={limits.searchTimeMax}
        step={500}
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
        step={16}
        value={settings.hashMb}
        onCommit={(n) => onChange({ hashMb: n }, true)}
      />

      <p className="font-mono text-[10px] text-text-muted">
        d{depth || "—"}
        {nps ? ` · ${(nps / 1_000_000).toFixed(2)} Mnps` : ""}
        {` · ${settings.multiPv} line${settings.multiPv === 1 ? "" : "s"}`}
      </p>
    </div>
  );
}
