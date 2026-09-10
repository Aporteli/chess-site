"use client";

import { useTrainer } from "@/lib/trainer/context";
import { SettingRow } from "@/components/trainer/settings/SettingRow";
import { SettingRangeRow } from "@/components/trainer/settings/SettingRangeRow";

export function BoardSettings() {
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
      
      <SettingRangeRow
        label="Opponent delay"
        min={80}
        max={900}
        step={20}
        value={settings.autoReplyDelay}
        onChange={(v) => setSettings({ autoReplyDelay: v })}
      />
    </div>
  );
}