import { useState } from "react";
import { Plus } from "lucide-react";

interface CreateRepertoireFormProps {
  onCreate: (name: string, side: "white" | "black") => void;
}

export function CreateRepertoireForm({ onCreate }: CreateRepertoireFormProps) {
  const [name, setName] = useState("");
  const [side, setSide] = useState<"white" | "black">("white");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name.trim(), side);
    setName("");
  };

  return (
    <form
      className="mb-6 flex flex-wrap items-end gap-2 rounded-xl border border-border-subtle bg-bg-surface p-3"
      onSubmit={handleSubmit}
    >
      <label className="min-w-[200px] flex-1 text-[11px] text-text-muted">
        New repertoire
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. White — 1.d4 systems"
          className="mt-1 w-full rounded-md border border-border-default bg-bg-elevated px-2.5 py-2 text-[13px] text-text-primary outline-none focus:border-accent-gold/40"
        />
      </label>
      <select
        value={side}
        onChange={(e) => setSide(e.target.value as "white" | "black")}
        className="rounded-md border border-border-default bg-bg-elevated px-2.5 py-2 text-[13px] text-text-secondary"
      >
        <option value="white">White</option>
        <option value="black">Black</option>
      </select>
      <button
        type="submit"
        className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-b from-accent-gold-bright to-accent-gold px-3 py-2 text-[13px] font-semibold text-[#241a10]"
      >
        <Plus className="h-3.5 w-3.5" />
        Create
      </button>
    </form>
  );
}