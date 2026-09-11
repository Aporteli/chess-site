import type { Chess } from "chess.js";

export type UciMove = {
  from: string;
  to: string;
  promotion?: string;
};

export const parseUciMove = (
  uci: string,
): UciMove | null => {
  if (uci.length < 4) {
    return null;
  }

  const from = uci.slice(0, 2);
  const to = uci.slice(2, 4);
  const promotion = uci[4];

  return {
    from,
    to,
    ...(promotion ? { promotion } : {}),
  };
};

export const playUciMove = (
  game: Chess,
  uci: string,
) => {
  const parsed = parseUciMove(uci);

  if (!parsed) {
    return null;
  }

  try {
    return game.move(parsed);
  } catch {
    return null;
  }
};