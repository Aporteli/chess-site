export type PlayerColor = "white" | "black";

export type ConnectionStatus = "offline" | "connecting" | "connected";

export type GameStatus =
  | "idle"
  | "searching"
  | "connecting"
  | "waiting"
  | "your-turn"
  | "opponent-turn"
  | "error";

export interface MultiplayerSession {
  gameId: string | null;
  playerColor: PlayerColor | null;
  opponentPresent: boolean;
  connection: ConnectionStatus;
  error: string | null;
}

/** Messages sent by the Cloudflare Durable Object room. */
export type ServerMessage =
  | { type: "connected"; color: PlayerColor; fen: string; turn: "w" | "b" }
  | { type: "state"; fen: string; turn: "w" | "b" }
  | {
      type: "move";
      color: PlayerColor;
      move: { from: string; to: string; san: string };
      fen: string;
      turn: "w" | "b";
    }
  | { type: "error"; message: string };

export type ClientMessage =
  | { type: "move"; move: { from: string; to: string; promotion?: string } }
  | { type: "state" };

export function colorFromTurn(turn: "w" | "b"): PlayerColor {
  return turn === "b" ? "black" : "white";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isTurn(value: unknown): value is "w" | "b" {
  return value === "w" || value === "b";
}

function isColor(value: unknown): value is PlayerColor {
  return value === "white" || value === "black";
}

/** Parses a raw socket payload, returning null for anything unrecognised. */
export function parseServerMessage(raw: unknown): ServerMessage | null {
  if (typeof raw !== "string") return null;

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!isRecord(data)) return null;

  if (
    data.type === "connected" &&
    isColor(data.color) &&
    typeof data.fen === "string" &&
    isTurn(data.turn)
  ) {
    return { type: "connected", color: data.color, fen: data.fen, turn: data.turn };
  }

  if (data.type === "state" && typeof data.fen === "string" && isTurn(data.turn)) {
    return { type: "state", fen: data.fen, turn: data.turn };
  }

  if (
    data.type === "move" &&
    isColor(data.color) &&
    typeof data.fen === "string" &&
    isTurn(data.turn) &&
    isRecord(data.move) &&
    typeof data.move.from === "string" &&
    typeof data.move.to === "string" &&
    typeof data.move.san === "string"
  ) {
    return {
      type: "move",
      color: data.color,
      move: { from: data.move.from, to: data.move.to, san: data.move.san },
      fen: data.fen,
      turn: data.turn,
    };
  }

  if (data.type === "error" && typeof data.message === "string") {
    return { type: "error", message: data.message };
  }

  return null;
}
