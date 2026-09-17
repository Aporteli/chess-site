"use client";

import { useTablebaseStore } from "@/stores/tablebase-store";

export function FenInput() {
  const fenInput = useTablebaseStore((s) => s.fenInput);
  const fenValid = useTablebaseStore((s) => s.fenValid);
  const applyFenInput = useTablebaseStore((s) => s.applyFenInput);

  return (
    <label className="flex shrink-0 h-14 flex-col justify-center rounded-xl border border-[#383838] bg-[#2A2A2A] p-2.5 shadow-lg">
      <span className="mb-0.5 block font-mono text-[10px] uppercase tracking-wider text-[#A0A0A0]">
        FEN
      </span>
      <input
        type="text"
        value={fenInput}
        onChange={(e) => applyFenInput(e.target.value)}
        spellCheck={false}
        className={`w-full bg-transparent font-mono text-xs outline-none transition-colors ${
          fenValid ? "text-white focus:text-[#769656]" : "text-[#E63946]"
        }`}
      />
    </label>
  );
}