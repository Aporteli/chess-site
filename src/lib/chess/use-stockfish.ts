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
  resultFen: string | null;
}

export type EngineSearchComplete = {
  fen: string;
  bestMove: string | null;
};

const DEFAULT_SETTINGS: EngineSettingsState = {
  searchTimeMs: 0.1,
  multiPv: 1,
  threads: 1,
  hashMb: 16,
  nnueModel: "hce",
};

const DEFAULT_LIMITS: EngineLimits = {
  searchTimeMin: 0.1,
  searchTimeMax: 30000,
  multiPvMax: 5,
  threadsMax: 2,
  hashMin: 16,
  hashMax: 256,
};
const PHONE_LIMITS: EngineLimits = {
  searchTimeMin: 0.1,
  searchTimeMax: 8000,
  multiPvMax: 3,
  threadsMax: 1,
  hashMin: 8,
  hashMax: 32,
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

function engineLines(raw: unknown): string[] {
  if (typeof raw === "string") {
    return raw
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
  }
  if (raw && typeof raw === "object") {
    const o = raw as { data?: unknown; line?: unknown };
    if (typeof o.data === "string") return engineLines(o.data);
    if (typeof o.line === "string") return engineLines(o.line);
  }
  return [];
}

function createEngineWorker(): Worker {
  // Public file — do not use `new URL(..., import.meta.url)` / origin URL.
  // Next/Turbopack intercepts that pattern and the worker request stays pending.
  return new Worker("/stockfish.wasm.js");
}

export function useStockfish() {
  const workerRef = useRef<Worker | null>(null);
  const currentTurnRef = useRef<"w" | "b">("w");
  const fenRef = useRef<string | null>(null);
  const settingsRef = useRef(DEFAULT_SETTINGS);
  const readyRef = useRef(false);
  const pendingGoRef = useRef(false);
  const searchingRef = useRef(false);
  const abandonSearchRef = useRef(false);
  const activeFenRef = useRef<string | null>(null);
  const jobIdRef = useRef(0);
  const activeJobIdRef = useRef(0);
  const completeCbRef = useRef<((result: EngineSearchComplete) => void) | null>(
    null,
  );
  const goWatchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enabledRef = useRef(true);
  const [enabled, setEnabledState] = useState(true);

  const [limits, setLimits] = useState<EngineLimits>(DEFAULT_LIMITS);

  const [settings, setSettings] =
    useState<EngineSettingsState>(DEFAULT_SETTINGS);
  settingsRef.current = settings;

  useEffect(() => {
    if (isMobileDevice()) {
      const next = {
        ...DEFAULT_SETTINGS,
        searchTimeMs: 0.1,
        threads: 1,
        hashMb: 8,
        nnueModel: "hce" as const,
      };
      settingsRef.current = next;
      setLimits(PHONE_LIMITS);
      setSettings(next);
      return;
    }
    const next = {
      ...DEFAULT_SETTINGS,
      threads: 1,
    };
    settingsRef.current = next;
    setLimits({
      ...DEFAULT_LIMITS,
      threadsMax: hardwareThreads(),
    });
    setSettings(next);
  }, []);

  const [state, setState] = useState<EngineEvaluation>({
    bestMove: null,
    evaluation: null,
    isThinking: false,
    lines: [],
    depth: 0,
    nps: 0,
    nodes: 0,
    resultFen: null,
  });

  const applyOptions = useCallback(() => {
    const w = workerRef.current;
    if (!w) return;
    const s = settingsRef.current;
    const nnue = NNUE_UCI[s.nnueModel];
    w.postMessage(`setoption name MultiPV value ${s.multiPv}`);
    w.postMessage("setoption name Threads value 1");
    w.postMessage(`setoption name Hash value ${Math.min(s.hashMb, 16)}`);
    w.postMessage(`setoption name Use NNUE value ${nnue.useNnue}`);
    if (nnue.evalFile) {
      w.postMessage(`setoption name EvalFile value ${nnue.evalFile}`);
    }
    w.postMessage("isready");
  }, []);

  const sendGo = useCallback(() => {
    const w = workerRef.current;
    const fen = fenRef.current;
    if (!w || !fen || !enabledRef.current) return;
    if (goWatchdogRef.current) {
      clearTimeout(goWatchdogRef.current);
      goWatchdogRef.current = null;
    }
    const turn = (fen.split(" ")[1] || "w") as "w" | "b";
    currentTurnRef.current = turn;
    activeFenRef.current = fen;
    activeJobIdRef.current = jobIdRef.current;
    searchingRef.current = true;
    setState((prev) => ({
      ...prev,
      isThinking: true,
      lines: [],
      bestMove: null,
      evaluation: null,
      depth: 0,
      resultFen: null,
    }));
    w.postMessage(
      `setoption name MultiPV value ${settingsRef.current.multiPv}`,
    );
    w.postMessage(`position fen ${fen}`);
    w.postMessage(`go movetime ${settingsRef.current.searchTimeMs}`);
  }, []);

  const [workerGen, setWorkerGen] = useState(0);

  useEffect(() => {
    let worker: Worker;
    try {
      worker = createEngineWorker();
    } catch (e) {
      console.error("Worker Creation Failed:", e);
      return;
    }
    workerRef.current = worker;

    worker.onerror = (err) => {
      err.preventDefault();
      console.error(
        "Stockfish Worker Error:",
        err.message,
        err.filename,
        err.lineno,
      );
    };

    worker.onmessage = (event: MessageEvent) => {
      for (const line of engineLines(event.data)) {
        if (line === "readyok") {
          readyRef.current = true;
          if (pendingGoRef.current && !searchingRef.current) {
            pendingGoRef.current = false;
            sendGo();
          }
          continue;
        }
        if (line === "uciok") {
          continue;
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
            const rawCp = parseInt(cp[1], 10) / 100;
            return currentTurnRef.current === "b" ? -rawCp : rawCp;
          }
          return null;
        };

        if (line.startsWith("info") && line.includes(" pv ")) {
          if (
            abandonSearchRef.current ||
            activeFenRef.current !== fenRef.current
          ) {
            continue;
          }
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
          const completedFen = activeFenRef.current;
          const completedJob = activeJobIdRef.current;
          const move = line.split(" ")[1] ?? null;
          const bestMove = move && move !== "(none)" ? move : null;
          const stale =
            abandonSearchRef.current ||
            completedJob !== jobIdRef.current ||
            completedFen !== fenRef.current;
          if (stale) {
            abandonSearchRef.current = false;
            if (pendingGoRef.current && enabledRef.current) {
              pendingGoRef.current = false;
              searchingRef.current = false;
              sendGo();
            }
            continue;
          }
          abandonSearchRef.current = false;

          searchingRef.current = false;
          setState((prev) => {
            const nextLines =
              prev.lines.length > 0 || !bestMove
                ? prev.lines
                : [
                    {
                      multipv: 1,
                      uci: bestMove,
                      pv: bestMove,
                      evaluation: prev.evaluation ?? 0,
                      depth: prev.depth || 1,
                    },
                  ];
            return {
              ...prev,
              bestMove: bestMove ?? prev.bestMove,
              isThinking: false,
              resultFen: completedFen,
              lines: nextLines,
            };
          });
          completeCbRef.current?.({
            fen: completedFen ?? "",
            bestMove,
          });

          if (pendingGoRef.current && enabledRef.current) {
            pendingGoRef.current = false;
            sendGo();
          }
        }
      }
    };

    worker.postMessage("uci");
    applyOptions();

    return () => {
      worker.terminate();
    };
  }, [applyOptions, sendGo, workerGen]);

  const evaluatePosition = useCallback(
    (fen: string, onComplete?: (result: EngineSearchComplete) => void) => {
      const parts = fen.trim().split(/\s+/);
      if (parts.length < 4 || !parts[0]?.includes("/")) return;
      completeCbRef.current = onComplete ?? null;
      jobIdRef.current += 1;
      fenRef.current = fen;
      if (!workerRef.current) return;
      if (!enabledRef.current) return;
      if (searchingRef.current) {
        pendingGoRef.current = true;
        workerRef.current.postMessage("stop");
        if (goWatchdogRef.current) clearTimeout(goWatchdogRef.current);
        goWatchdogRef.current = setTimeout(() => {
          goWatchdogRef.current = null;
          if (!pendingGoRef.current || !enabledRef.current) return;
          pendingGoRef.current = false;
          searchingRef.current = false;
          abandonSearchRef.current = true;
          sendGo();
        }, 600);
        return;
      }
      if (readyRef.current) {
        sendGo();
      } else {
        pendingGoRef.current = true;
        workerRef.current.postMessage("isready");
      }
    },
    [sendGo],
  );

  const stop = useCallback(() => {
    if (!workerRef.current) return;
    pendingGoRef.current = false;
    completeCbRef.current = null;
    jobIdRef.current += 1;
    if (goWatchdogRef.current) {
      clearTimeout(goWatchdogRef.current);
      goWatchdogRef.current = null;
    }
    if (searchingRef.current) {
      abandonSearchRef.current = true;
      workerRef.current.postMessage("stop");
    }
    searchingRef.current = false;
    setState((prev) => ({ ...prev, isThinking: false }));
  }, []);

  const setOption = useCallback((name: string, value: string) => {
    workerRef.current?.postMessage(`setoption name ${name} value ${value}`);
  }, []);

  const commitSettings = useCallback(
    (patch: Partial<EngineSettingsState>, restart: boolean) => {
      setSettings((prev) => {
        const next = { ...prev, ...patch };
        settingsRef.current = next;
        return next;
      });
      const needsNewWorker =
        patch.hashMb !== undefined ||
        patch.nnueModel !== undefined ||
        patch.threads !== undefined;
      if (needsNewWorker) {
        workerRef.current?.terminate();
        workerRef.current = null;
        readyRef.current = false;
        if (restart && fenRef.current && enabledRef.current) {
          pendingGoRef.current = true;
        }
        // bump a `workerGen` state so the existing worker useEffect remounts
        setWorkerGen((n) => n + 1);
        return;
      }
      const w = workerRef.current;
      if (!w) return;
      if (searchingRef.current) {
        abandonSearchRef.current = true;
        w.postMessage("stop");
      }
      applyOptions();
      if (restart && fenRef.current && enabledRef.current) {
        pendingGoRef.current = true;
      }
    },
    [applyOptions],
  );

  const resetEngine = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.postMessage("stop");
      workerRef.current.postMessage("ucinewgame");
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
      resultFen: null,
    });
  }, [applyOptions]);

  const setEnabled = useCallback(
    (on: boolean) => {
      enabledRef.current = on;
      setEnabledState(on);
      if (!on) {
        pendingGoRef.current = false;
        completeCbRef.current = null;
        jobIdRef.current += 1;
        if (searchingRef.current) {
          abandonSearchRef.current = true;
          workerRef.current?.postMessage("stop");
        }
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
