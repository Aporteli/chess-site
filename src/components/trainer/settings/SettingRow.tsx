"use client";

interface SettingRowProps {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

export function SettingRow({ label, checked, onChange }: SettingRowProps) {
  return (
    <label className="flex items-center justify-between gap-3 py-1 text-[12.5px] text-text-secondary">
      {label}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-[#c9a256]"
      />
    </label>
  );
}