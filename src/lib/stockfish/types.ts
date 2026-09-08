export interface EngineLine {
  multipv: number;
  uci: string;
  pv: string;
  evaluation: number;
  depth: number;
}

export type NnueModel = "nnue-85" | "nnue-108" | "nnue-lite" | "hce";

export type EngineSettingsState = {
  searchTimeMs: number;
  multiPv: number;
  threads: number;
  hashMb: number;
  nnueModel: NnueModel;
};

export type EngineLimits = {
  searchTimeMin: number;
  searchTimeMax: number;
  multiPvMax: number;
  threadsMax: number;
  hashMin: number;
  hashMax: number;
};

export type EngineEvaluation = {
  bestMove: string | null;
  evaluation: number | null;
  isThinking: boolean;
  lines: EngineLine[];
  depth: number;
  nps: number;
  nodes: number;
  resultFen: string | null;
};

export type EngineSearchComplete = {
  fen: string;
  bestMove: string | null;
};
