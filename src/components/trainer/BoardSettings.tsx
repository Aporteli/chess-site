"use client";

import { useTrainer } from "@/lib/trainer/context";

function SettingRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
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

export function BoardSettingsPanel() {
  const { settings, setSettings } = useTrainer();

  return (
    <div className="hidden rounded-xl border border-border-subtle bg-bg-surface p-4">
      <h3 className="mb-2 font-serif-display text-[15px] text-text-primary">Board</h3>
      <SettingRow
        label="Move sounds"
        checked={settings.sound}
        onChange={(v) => setSettings({ sound: v })}
      />
      <SettingRow
        label="Legal-move hints"
        checked={settings.legalHints}
        onChange={(v) => setSettings({ legalHints: v })}
      />
      <SettingRow
        label="Animations"
        checked={settings.animations}
        onChange={(v) => setSettings({ animations: v })}
      />
      <SettingRow
        label="Coordinates"
        checked={settings.coordinates}
        onChange={(v) => setSettings({ coordinates: v })}
      />
      <label className="mt-1 flex items-center justify-between gap-3 py-1 text-[12.5px] text-text-secondary">
        Opponent delay
        <input
          type="range"
          min={80}
          max={900}
          step={20}
          value={settings.autoReplyDelay}
          onChange={(e) => setSettings({ autoReplyDelay: Number(e.target.value) })}
        />
      </label>
    </div>
  );
}
