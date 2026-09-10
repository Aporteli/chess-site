import { Chess } from "chess.js";

const FIGURINE: Record<"w" | "b", Record<string, string>> = {
  w: { K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘" },
  b: { K: "♚", Q: "♛", R: "♜", B: "♝", N: "♞" },
};

export function isUci(s: string) {
  return /^[a-h][1-8][a-h][1-8][qrbn]?$/i.test(s);
}

export function toFigurineSan(san: string, color: "w" | "b") {
  return san.replace(/^[KQRBN]/, (piece) => FIGURINE[color][piece] ?? piece);
}

export function parseUci(uci: string) {
  return {
    from: uci.slice(0, 2),
    to: uci.slice(2, 4),
    ...(uci[4] ? { promotion: uci[4] } : {}),
  };
}

export function pvItems(pv: string, fen: string, turn: "w" | "b", moveNumber: number) {
  const moves = pv.split(/\s+/).filter(isUci);
  const items: {
    key: string;
    kind: "num" | "move";
    text: string;
    ply?: number;
  }[] = [];
  const game = new Chess(fen);
  let n = moveNumber;
  let side = turn;

  moves.forEach((uci, ply) => {
    if (side === "w")
      items.push({ key: `n-${ply}`, kind: "num", text: `${n}.` });
    else if (ply === 0)
      items.push({ key: `n-${ply}`, kind: "num", text: `${n}...` });

    let text = uci;
    try {
      const mv = game.move(parseUci(uci));
      if (mv) text = toFigurineSan(mv.san, mv.color);
    } catch {
      // keep UCI if illegal
    }
    items.push({ key: `m-${ply}`, kind: "move", text, ply });
    if (side === "b") n += 1;
    side = side === "w" ? "b" : "w";
  });
  return { moves, items };
}