import type { AnalysisState } from "./analysis-types";
import { createChessGame } from "../chess-game";

const initialGame = createChessGame();
const initialFen = initialGame.fen();

export const createInitialAnalysisState =
  (): AnalysisState => ({
    game: createChessGame(),

    fen: initialFen,

    history: [],

    undoneMoves: [],

    flipped: false,

    sound: true,

    arrows: [],

    isUploadBoardOpen: false,

    startFen: initialFen,

    saveState: "idle",

    saveMessage: "",

    revision: 0,
  });