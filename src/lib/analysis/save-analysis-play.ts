import type { Chess } from "chess.js";
import type { SaveState } from "./analysis-store";

type SaveResult = {
  state: SaveState;
  message: string;
};

export async function saveAnalysisPlay(
  game: Chess,
  history: string[],
  startFen: string,
  fen: string,
  authenticated: boolean,
): Promise<SaveResult> {
  if (!authenticated) {
    return {
      state: "error",
      message: "Sign in first, then save from Analysis.",
    };
  }

  const result = game.isCheckmate()
    ? game.turn() === "w"
      ? "0-1"
      : "1-0"
    : game.isDraw()
      ? "1/2-1/2"
      : "*";

  try {
    const response = await fetch("/api/plays", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `Analysis · ${history.length} moves`,
        source: "analysis",
        result,
        pgn: game.pgn(),
        startFen,
        currentFen: fen,
      }),
    });

    const data = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      return {
        state: "error",
        message: data?.error ?? "Could not save play.",
      };
    }

    return {
      state: "saved",
      message: "Saved. Open Profile to see it.",
    };
  } catch {
    return {
      state: "error",
      message: "Could not save play.",
    };
  }
}
