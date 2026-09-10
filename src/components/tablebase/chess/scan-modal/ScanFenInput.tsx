"use client";

interface ScanFenInputProps {
  value: string;
  sideToMove: "w" | "b";
  onChangeValue: (val: string) => void;
  onChangeSide: (side: "w" | "b") => void;
}

export function ScanFenInput({
  value,
  sideToMove,
  onChangeValue,
  onChangeSide,
}: ScanFenInputProps) {
  return (
    <>
      <div className="relative my-3 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-subtle" />
        </div>
        <span className="relative bg-surface px-2 text-2xs uppercase text-subtle">or paste FEN</span>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChangeValue(e.target.value)}
        rows={2}
        spellCheck={false}
        placeholder="8/8/8/4k3/8/8/4P3/4K3 w - - 0 1"
        className="w-full rounded-md bg-elevated p-3 font-mono text-xs text-fg outline-none shadow-[var(--shadow-border)] placeholder:text-subtle"
      />

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-muted">Side to move:</span>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => onChangeSide("w")}
            className={`rounded px-3 py-1 text-xs font-medium transition ${
              sideToMove === "w"
                ? "bg-accent-gold-bright text-bg-deepest font-semibold"
                : "bg-elevated text-muted hover:text-fg"
            }`}
          >
            White
          </button>
          <button
            type="button"
            onClick={() => onChangeSide("b")}
            className={`rounded px-3 py-1 text-xs font-medium transition ${
              sideToMove === "b"
                ? "bg-accent-gold-bright text-bg-deepest font-semibold"
                : "bg-elevated text-muted hover:text-fg"
            }`}
          >
            Black
          </button>
        </div>
      </div>
    </>
  );
}