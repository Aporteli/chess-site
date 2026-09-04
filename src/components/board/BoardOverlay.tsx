// src/components/board/BoardOverlay.tsx
import { Check, X } from "lucide-react";
import type { MoveStatus } from "@/lib/types";

interface BoardOverlayProps {
  status: MoveStatus;
}

/**
 * Transient feedback shown over the board after a move is played.
 * Purely presentational — the real trainer logic decides when `status`
 * changes and clears it after the move is acknowledged.
 */
export function BoardOverlay({ status }: BoardOverlayProps) {
  if (status === "pending") return null;

  const isCorrect = status === "correct";
  const isMistake = status === "mistake";

  return (
    <div
      className={[
        "pointer-events-none absolute inset-0 z-10 flex items-start justify-center rounded-xl transition-opacity duration-300",
        isCorrect ? "shadow-[inset_0_0_0_3px_rgba(232,197,121,0.6)]" : "",
        isMistake ? "shadow-[inset_0_0_0_3px_rgba(221,128,105,0.6)]" : "",
      ].join(" ")}
    >
      {(isCorrect || isMistake) && (
        <div
          className={[
            "mt-4 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-semibold backdrop-blur-md",
            isCorrect
              ? "border-accent-gold/40 bg-accent-gold-dim/90 text-accent-gold-bright"
              : "border-accent-garnet/40 bg-accent-garnet-dim/90 text-accent-garnet",
          ].join(" ")}
        >
          {isCorrect ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
          {isCorrect ? "Correct move!" : "That's a mistake — try again"}
        </div>
      )}
    </div>
  );
}
