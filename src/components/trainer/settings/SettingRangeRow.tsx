"use client";

interface SettingRangeRowProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}

export function SettingRangeRow({
  label,
  min,
  max,
  step,
  value,
  onChange,
}: SettingRangeRowProps) {
  return (
    <label className="mt-1 flex items-center justify-between gap-3 py-1 text-[12.5px] text-text-secondary">
      {label}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}