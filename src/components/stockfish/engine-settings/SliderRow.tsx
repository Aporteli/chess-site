"use client";

interface SliderRowProps {
  label: string;
  valueText: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onCommit: (n: number) => void;
}

export function SliderRow({
  label,
  valueText,
  min,
  max,
  step,
  value,
  onCommit,
}: SliderRowProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <label className="grid grid-cols-[6.5rem_minmax(0,1fr)_4.25rem] items-center gap-2 text-[12px] text-text-secondary sm:grid-cols-[7.5rem_minmax(0,1fr)_4.25rem]">
      <span className="truncate">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onCommit(Number(e.target.value))}
        className="engine-range h-1.5 min-w-0 w-full max-w-none cursor-pointer appearance-none rounded-full"
        style={{
          background: `linear-gradient(to right, var(--color-accent-gold, #c9a256) ${pct}%, var(--color-border-default, #3a3122) ${pct}%)`,
        }}
      />
      <span className="text-right font-mono text-[11px] text-text-primary">
        {valueText}
      </span>
    </label>
  );
}