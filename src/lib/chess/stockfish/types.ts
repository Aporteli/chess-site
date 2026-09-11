export interface EngineLine {
    multipv: number;
    uci: string;
    pv: string;
    evaluation: number;
    depth: number;
  }
  
  export type NnueModel = "nnue-85" | "nnue-108" | "nnue-lite" | "hce";
  
  export const NNUE_OPTIONS: { value: NnueModel; label: string }[] = [
    { value: "hce", label: "HCE" },
    { value: "nnue-lite", label: "NNUE · 15MB Lite" },
    { value: "nnue-85", label: "NNUE · 85MB" },
    { value: "nnue-108", label: "NNUE · 108MB" },
  ];
  
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
  
  export interface EngineEvaluation {
    bestMove: string | null;
    evaluation: number | null;
    isThinking: boolean;
    lines: EngineLine[];
    depth: number;
    nps: number;
    nodes: number;
    resultFen: string | null;
  }
  
  export type EngineSearchComplete = {
    fen: string;
    bestMove: string | null;
  };
  
  export const DEFAULT_SETTINGS: EngineSettingsState = {
    searchTimeMs: 1000,
    multiPv: 1,
    threads: 1,
    hashMb: 8,
    nnueModel: "hce",
  };
  
  export const DEFAULT_LIMITS: EngineLimits = {
    searchTimeMin: 250,
    searchTimeMax: 30000,
    multiPvMax: 5,
    threadsMax: 1,
    hashMin: 8,
    hashMax: 16,
  };
  
  export const PHONE_LIMITS: EngineLimits = {
    searchTimeMin: 250,
    searchTimeMax: 8000,
    multiPvMax: 3,
    threadsMax: 1,
    hashMin: 8,
    hashMax: 8,
  };
  
  export const ENGINE_SCRIPTS = ["/stockfish.wasm.js", "/stockfish.js"];