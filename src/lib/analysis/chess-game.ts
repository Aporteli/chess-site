import { Chess } from "chess.js";

export const createChessGame = (fen?: string): Chess => {
  return fen ? new Chess(fen) : new Chess();
};