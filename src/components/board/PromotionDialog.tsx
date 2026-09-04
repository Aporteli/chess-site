"use client";

const PIECES = [
  { key: "q" as const, white: "♕", black: "♛", label: "Queen" },
  { key: "r" as const, white: "♖", black: "♜", label: "Rook" },
  { key: "b" as const, white: "♗", black: "♝", label: "Bishop" },
  { key: "n" as const, white: "♘", black: "♞", label: "Knight" },
];

interface PromotionDialogProps {
  color: "w" | "b";
  onPick: (piece: "q" | "r" | "b" | "n") => void;
  onCancel: () => void;
}

export function PromotionDialog({ color, onPick, onCancel }: PromotionDialogProps) {
  return (
    <div className="absolute inset-0 z-20 grid place-items-center bg-black/45 backdrop-blur-[2px]">
      <div className="rounded-xl border border-border-default bg-bg-surface p-3 shadow-panel">
        <p className="mb-2 text-center font-serif-display text-[13px] text-text-secondary">
          Promote to
        </p>
        <div className="flex gap-1.5">
          {PIECES.map((p) => (
            <button
              key={p.key}
              aria-label={p.label}
              onClick={() => onPick(p.key)}
              className="grid h-12 w-12 place-items-center rounded-lg border border-border-default bg-bg-elevated text-[28px] leading-none transition-colors hover:border-accent-gold/50 hover:bg-accent-gold-dim"
            >
              {color === "w" ? p.white : p.black}
            </button>
          ))}
        </div>
        <button
          onClick={onCancel}
          className="mt-2 w-full rounded-md py-1 text-[11px] text-text-muted hover:text-text-secondary"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
