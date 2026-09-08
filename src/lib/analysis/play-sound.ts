import { playSfx, sfxForMove } from "@/lib/chess/sounds";
import type { Move } from "chess.js";

export function playMoveSound(move: Move, gameInCheck: boolean, gameIsMate: boolean, enabled: boolean) {
  playSfx(
    sfxForMove({
      capture: move.captured !== undefined,
      castle: move.flags.includes("k")
        ? "k"
        : move.flags.includes("q")
          ? "q"
          : null,
      check: gameInCheck,
      mate: gameIsMate,
      promotion: move.promotion !== undefined,
    }),
    enabled,
  );
}
