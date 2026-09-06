"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  createElement,
  type ReactNode,
} from "react";

export interface EngineLine {
  multipv: number;
  uci: string;
  pv: string;
  evaluation: number;
  depth: number;
}

export type NnueModel = "nnue-85" | "nnue-108" | "nnue-lite" | "hce";

export const NNUE_OPTIONS: { value: NnueModel; label: string }[] = [
  { value: "nnue-85", label: "NNUE · 85MB" },
  { value: "nnue-108", label: "NNUE · 108MB" },
  { value: "nnue-lite", label: "NNUE · 15MB Lite" },
  { value: "hce", label: "HCE" },
];

const NNUE_UCI: Record<NnueModel, { useNnue: boolean; evalFile?: string }> = {
  "nnue-85": { useNnue: true, evalFile: "nn-85.nnue" },
  "nnue-108": { useNnue: true, evalFile: "nn-108.nnue" },
  "nnue-lite": { useNnue: true, evalFile: "nn-lite-15.nnue" },
  hce: { useNnue: false },
};

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

interface EngineEvaluation {
  bestMove: string | null;
  evaluation: number | null;
  isThinking: boolean;
  lines: EngineLine[];
  depth: number;
  nps: number;
  nodes: number;
}

const DEFAULT_SETTINGS: EngineSettingsState = {
  searchTimeMs: 8000,
  multiPv: 1,
  threads: 1,
  hashMb: 16,
  nnueModel: "nnue-85",
};

function hardwareThreads() {
  if (typeof navigator === "undefined") return 2;
  return Math.max(1, navigator.hardwareConcurrency || 2);
}

function isMobileDevice() {
  if (typeof navigator === "undefined") return false;
  const iPadOS =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || iPadOS;
}

function canUseThreadedWasm() {
  return (
    typeof SharedArrayBuffer !== "undefined" &&
    typeof crossOriginIsolated !== "undefined" &&
    crossOriginIsolated === true
  );
}

function createEngineWorker(): Worker {
  const src = `${self.location.origin}/stockfish.wasm.js`;
  const blob = new Blob([`importScripts(${JSON.stringify(src)});`], {
    type: "text/javascript",
  });
  const url = URL.createObjectURL(blob);
  const worker = new Worker(url);
  URL.revokeObjectURL(url);
  return worker;
}

export function useStockfish() {
  const workerRef = useRef<Worker | null>(null);
  const currentTurnRef = useRef<"w" | "b">("w");
  const fenRef = useRef<string | null>(null);
  const settingsRef = useRef(DEFAULT_SETTINGS);
  const readyRef = useRef(false);
  const uciOkRef = useRef(false);
  const cmdQueueRef = useRef<string[]>([]);
  const pendingGoRef = useRef(false);
  const enabledRef = useRef(true);
  const [enabled, setEnabledState] = useState(true);

  const [limits] = useState<EngineLimits>(() => {
    const phone = isMobileDevice();
    return {
      searchTimeMin: 500,
      searchTimeMax: phone ? 8000 : 30000,
      multiPvMax: phone ? 3 : 5,
      threadsMax: phone ? 1 : hardwareThreads(),
      hashMin: phone ? 8 : 16,
      hashMax: phone ? 32 : 256,
    };
  });

  const [settings, setSettings] = useState<EngineSettingsState>(() => {
    const phone = isMobileDevice();
    return {
      ...DEFAULT_SETTINGS,
      searchTimeMs: phone ? 2000 : DEFAULT_SETTINGS.searchTimeMs,
      threads: phone ? 1 : Math.min(2, hardwareThreads()),
      hashMb: phone ? 8 : DEFAULT_SETTINGS.hashMb,
      nnueModel: phone ? "hce" : DEFAULT_SETTINGS.nnueModel,
    };
  });
  settingsRef.current = settings;

  const [state, setState] = useState<EngineEvaluation>({
    bestMove: null,
    evaluation: null,
    isThinking: false,
    lines: [],
    depth: 0,
    nps: 0,
    nodes: 0,
  });

  const postUci = useCallback((cmd: string) => {
    const w = workerRef.current;
    if (!w) return;
    if (!uciOkRef.current && cmd !== "uci") {
      cmdQueueRef.current.push(cmd);
      return;
    }
    w.postMessage(cmd);
  }, []);

  const applyOptions = useCallback(() => {
    const w = workerRef.current;
    if (!w) return;
    const s = settingsRef.current;
    const nnue = NNUE_UCI[s.nnueModel];
    postUci(`setoption name MultiPV value ${s.multiPv}`);
    postUci(`setoption name Threads value 1`);
    postUci(`setoption name Hash value ${s.hashMb}`);
    postUci(`setoption name Use NNUE value ${nnue.useNnue}`);
    if (nnue.evalFile && !isMobileDevice()) {
      postUci(`setoption name EvalFile value ${nnue.evalFile}`);
    }
    postUci("isready");
  }, [postUci]);

  const sendGo = useCallback(() => {
    const w = workerRef.current;
    const fen = fenRef.current;
    if (!w || !fen || !enabledRef.current) return;
    const turn = (fen.split(" ")[1] || "w") as "w" | "b";
    currentTurnRef.current = turn;
    setState((prev) => ({
      ...prev,
      isThinking: true,
    }));
    postUci(`setoption name MultiPV value ${settingsRef.current.multiPv}`);
    postUci(`position fen ${fen}`);
    postUci(`go movetime ${settingsRef.current.searchTimeMs}`);
  }, [postUci]);

  useEffect(() => {
    let worker: Worker;
    try {
      worker = createEngineWorker();
    } catch {
      return;
    }
    workerRef.current = worker;
    worker.onerror = () => {};

    worker.onmessage = (event: MessageEvent) => {
      const raw = event.data;
      const line =
        typeof raw === "string"
          ? raw
          : typeof raw?.data === "string"
            ? raw.data
            : "";
      if (line === "uciok") {
        uciOkRef.current = true;
        const queued = cmdQueueRef.current.splice(0);
        queued.forEach((c) => worker.postMessage(c));
        return;
      }
      if (line === "readyok") {
        readyRef.current = true;
        if (pendingGoRef.current) {
          pendingGoRef.current = false;
          sendGo();
        }
        return;
      }

      const parseScore = () => {
        const mate = line.match(/score mate (-?\d+)/);
        if (mate) {
          const n = parseInt(mate[1], 10);
          const isWhite = currentTurnRef.current === "w";
          return n > 0 ? (isWhite ? 100 : -100) : isWhite ? -100 : 100;
        }
        const cp = line.match(/score cp (-?\d+)/);
        if (cp) {
          const raw = parseInt(cp[1], 10) / 100;
          return currentTurnRef.current === "b" ? -raw : raw;
        }
        return null;
      };

      if (line.startsWith("info") && line.includes(" pv ")) {
        const score = parseScore();
        const pvMatch = line.match(/ pv (.+)$/);
        const mpv = Number(line.match(/multipv (\d+)/)?.[1] ?? 1);
        const depth = Number(line.match(/\bdepth (\d+)/)?.[1] ?? 0);
        const nps = Number(line.match(/\bnps (\d+)/)?.[1] ?? 0);
        const nodes = Number(line.match(/\bnodes (\d+)/)?.[1] ?? 0);
        if (score !== null && pvMatch) {
          const pv = pvMatch[1].trim();
          const uci = pv.split(" ")[0] ?? "";
          setState((prev) => {
            const next = [
              ...prev.lines.filter((l) => l.multipv !== mpv),
              { multipv: mpv, uci, pv, evaluation: score, depth },
            ];
            next.sort((a, b) => a.multipv - b.multipv);
            return {
              ...prev,
              evaluation: mpv === 1 ? score : prev.evaluation,
              bestMove: mpv === 1 ? uci : prev.bestMove,
              lines: next,
              depth: mpv === 1 ? depth : prev.depth,
              nps: nps || prev.nps,
              nodes: nodes || prev.nodes,
            };
          });
        }
      }

      if (line.startsWith("bestmove")) {
        const move = line.split(" ")[1];
        setState((prev) => ({
          ...prev,
          bestMove: move !== "(none)" ? move : prev.bestMove,
          isThinking: false,
        }));
      }
    };

    worker.postMessage("uci");
    applyOptions();

    return () => {
      worker.terminate();
    };
  }, [applyOptions, sendGo]);

  const evaluatePosition = useCallback(
    (fen: string, _depth?: number) => {
      if (!workerRef.current) return;
      fenRef.current = fen;
      if (!enabledRef.current) return;
      postUci("stop");
      if (readyRef.current) {
        sendGo();
      } else {
        pendingGoRef.current = true;
        postUci("isready");
      }
    },
    [sendGo, postUci],
  );

  const stop = useCallback(() => {
    if (!workerRef.current) return;
    pendingGoRef.current = false;
    workerRef.current.postMessage("stop");
    setState((prev) => ({ ...prev, isThinking: false }));
  }, []);

  const setOption = useCallback((name: string, value: string) => {
    postUci(`setoption name ${name} value ${value}`);
  }, []);

  const commitSettings = useCallback(
    (patch: Partial<EngineSettingsState>, restart: boolean) => {
      setSettings((prev) => {
        const next = { ...prev, ...patch };
        settingsRef.current = next;
        return next;
      });
      const w = workerRef.current;
      if (!w) return;
      postUci("stop");
      applyOptions();
      if (restart && fenRef.current && enabledRef.current) {
        pendingGoRef.current = true;
      }
    },
    [applyOptions],
  );

  const resetEngine = useCallback(() => {
    if (workerRef.current) {
      postUci("stop");
      postUci("ucinewgame");
      applyOptions();
    }
    setState({
      bestMove: null,
      evaluation: 0,
      isThinking: false,
      lines: [],
      depth: 0,
      nps: 0,
      nodes: 0,
    });
  }, [applyOptions]);

  const setEnabled = useCallback(
    (on: boolean) => {
      enabledRef.current = on;
      setEnabledState(on);
      if (!on) {
        pendingGoRef.current = false;
        workerRef.current?.postMessage("stop");
        setState((prev) => ({ ...prev, isThinking: false }));
        return;
      }
      if (fenRef.current && workerRef.current) {
        pendingGoRef.current = true;
        applyOptions();
      }
    },
    [applyOptions],
  );

  return {
    ...state,
    enabled,
    settings,
    limits,
    evaluatePosition,
    stop,
    resetEngine,
    setOption,
    commitSettings,
    setEnabled,
  };
}

const StockfishContext = createContext<ReturnType<typeof useStockfish> | null>(
  null,
);

export function StockfishProvider({
  fen,
  children,
}: {
  fen: string;
  children: ReactNode;
}) {
  const engine = useStockfish();

  useEffect(() => {
    engine.evaluatePosition(fen);
  }, [fen, engine.evaluatePosition]);

  return createElement(StockfishContext.Provider, { value: engine }, children);
}

export function useStockfishEngine() {
  const ctx = useContext(StockfishContext);
  if (!ctx)
    throw new Error("useStockfishEngine must be used within StockfishProvider");
  return ctx;
}
