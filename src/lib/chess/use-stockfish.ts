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
  searchTimeMs: 1000,
  multiPv: 1,
  threads: 1,
  hashMb: 8,
  nnueModel: "hce",
};

const DEFAULT_LIMITS: EngineLimits = {
  searchTimeMin: 250,
  searchTimeMax: 30000,
  multiPvMax: 5,
  threadsMax: 1,
  hashMin: 8,
  hashMax: 16,
};
const PHONE_LIMITS: EngineLimits = {
  searchTimeMin: 250,
  searchTimeMax: 8000,
  multiPvMax: 3,
  threadsMax: 1,
  hashMin: 8,
  hashMax: 8,
};

const ENGINE_SCRIPTS = ["/stockfish.wasm.js", "/stockfish.js"];

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
  if (typeof raw === "number" || typeof raw === "boolean") return [];
  if (raw && typeof raw === "object") {
    const o = raw as { data?: unknown; line?: unknown };
    if (typeof o.data === "string") return engineLines(o.data);
    if (typeof o.line === "string") return engineLines(o.line);
  }
  return [];
}

function post(w: Worker | null, msg: string) {
  if (!w) return false;
  try {
    w.postMessage(msg);
    return true;
  } catch {
    return false;
  }
}

export function useStockfish() {
  const workerRef = useRef<Worker | null>(null);
  const currentTurnRef = useRef<"w" | "b">("w");
  const fenRef = useRef<string | null>(null);
  const settingsRef = useRef(DEFAULT_SETTINGS);
  const readyRef = useRef(false);
  const uciOkRef = useRef(false);
  const pendingGoRef = useRef(false);
  const searchingRef = useRef(false);
  const activeFenRef = useRef<string | null>(null);
  const lastUciRef = useRef<string | null>(null);
  const completeCbRef = useRef<((result: EngineSearchComplete) => void) | null>(
    null,
  );
  const enabledRef = useRef(true);
  const goTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [enabled, setEnabledState] = useState(true);
  const [limits, setLimits] = useState<EngineLimits>(DEFAULT_LIMITS);
  const [settings, setSettings] =
    useState<EngineSettingsState>(DEFAULT_SETTINGS);
  settingsRef.current = settings;

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

  const [workerGen, setWorkerGen] = useState(0);

  useEffect(() => {
    if (isMobileDevice()) {
      const next = {
        ...DEFAULT_SETTINGS,
        searchTimeMs: 600,
        hashMb: 8,
      };
      settingsRef.current = next;
      setLimits(PHONE_LIMITS);
      setSettings(next);
    }
  }, []);

  useEffect(() => {
    let worker: Worker | null = null;
    let scriptIndex = 0;
    let stopped = false;
    let objectUrl: string | null = null;

    const clearGoTimer = () => {
      if (goTimerRef.current) {
        clearTimeout(goTimerRef.current);
        goTimerRef.current = null;
      }
    };

    const finishSearch = (bestMove: string | null, fromFen: string | null) => {
      clearGoTimer();
      searchingRef.current = false;
      const isCurrent = fromFen != null && fromFen === fenRef.current;
      const move = bestMove && bestMove !== "(none)" ? bestMove : null;
      if (isCurrent) {
        setState((prev) => {
          const resolved = move ?? prev.bestMove ?? lastUciRef.current;
          const nextLines =
            prev.lines.length > 0 || !resolved
              ? prev.lines
              : [
                  {
                    multipv: 1,
                    uci: resolved,
                    pv: resolved,
                    evaluation: prev.evaluation ?? 0,
                    depth: prev.depth || 1,
                  },
                ];
          return {
            ...prev,
            bestMove: resolved,
            isThinking: false,
            resultFen: fromFen,
            lines: nextLines,
          };
        });
        const cb = completeCbRef.current;
        completeCbRef.current = null;
        cb?.({
          fen: fromFen ?? "",
          bestMove: move ?? lastUciRef.current,
        });
      } else {
        setState((prev) => ({ ...prev, isThinking: false }));
      }
    };

    const sendGo = () => {
      const w = workerRef.current;
      const fen = fenRef.current;
      if (!w || !fen || !enabledRef.current || !readyRef.current) return;
      currentTurnRef.current = (fen.split(" ")[1] || "w") as "w" | "b";
      activeFenRef.current = fen;
      lastUciRef.current = null;
      searchingRef.current = true;
      pendingGoRef.current = false;
      setState((prev) => ({
        ...prev,
        isThinking: true,
        lines: [],
        bestMove: null,
        evaluation: null,
        depth: 0,
        resultFen: null,
      }));
      const ms = Math.max(50, Math.round(settingsRef.current.searchTimeMs));
      post(w, `setoption name MultiPV value ${settingsRef.current.multiPv}`);
      post(w, `position fen ${fen}`);
      post(w, `go movetime ${ms}`);
      clearGoTimer();
      goTimerRef.current = setTimeout(() => {
        goTimerRef.current = null;
        if (!searchingRef.current) return;
        post(w, "stop");
        goTimerRef.current = setTimeout(() => {
          goTimerRef.current = null;
          if (!searchingRef.current) return;
          finishSearch(lastUciRef.current, activeFenRef.current);
          if (pendingGoRef.current && enabledRef.current && readyRef.current) {
            sendGo();
          }
        }, 1500);
      }, ms + 2000);
    };

    const onLine = (line: string) => {
      if (line === "uciok") {
        uciOkRef.current = true;
        const w = workerRef.current;
        post(w, `setoption name MultiPV value ${settingsRef.current.multiPv}`);
        post(w, "setoption name Hash value 4");
        post(w, "isready");
        return;
      }
      if (line === "readyok") {
        readyRef.current = true;
        if (pendingGoRef.current && !searchingRef.current) sendGo();
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
          const rawCp = parseInt(cp[1], 10) / 100;
          return currentTurnRef.current === "b" ? -rawCp : rawCp;
        }
        return null;
      };

      if (line.startsWith("info")) {
        if (activeFenRef.current !== fenRef.current) return;
        const score = parseScore();
        const depth = Number(line.match(/\bdepth (\d+)/)?.[1] ?? 0);
        const nps = Number(line.match(/\bnps (\d+)/)?.[1] ?? 0);
        const nodes = Number(line.match(/\bnodes (\d+)/)?.[1] ?? 0);
        const pvMatch = line.match(/ pv (.+)$/);
        const mpv = Number(line.match(/multipv (\d+)/)?.[1] ?? 1);
        if (pvMatch) {
          const pv = pvMatch[1].trim();
          const uci = pv.split(" ")[0] ?? "";
          if (mpv === 1 && uci) lastUciRef.current = uci;
          setState((prev) => {
            const next = [
              ...prev.lines.filter((l) => l.multipv !== mpv),
              {
                multipv: mpv,
                uci,
                pv,
                evaluation: score ?? prev.evaluation ?? 0,
                depth,
              },
            ];
            next.sort((a, b) => a.multipv - b.multipv);
            return {
              ...prev,
              evaluation:
                mpv === 1 && score !== null ? score : prev.evaluation,
              bestMove: mpv === 1 && uci ? uci : prev.bestMove,
              lines: next,
              depth: mpv === 1 && depth ? depth : prev.depth,
              nps: nps || prev.nps,
              nodes: nodes || prev.nodes,
            };
          });
        } else if (score !== null || depth) {
          setState((prev) => ({
            ...prev,
            evaluation: score ?? prev.evaluation,
            depth: depth || prev.depth,
            nps: nps || prev.nps,
            nodes: nodes || prev.nodes,
          }));
        }
      }

      if (line.startsWith("bestmove")) {
        const completedFen = activeFenRef.current;
        const move = line.split(" ")[1] ?? null;
        const bestMove = move && move !== "(none)" ? move : null;
        if (bestMove) lastUciRef.current = bestMove;
        finishSearch(bestMove, completedFen);
        if (pendingGoRef.current && enabledRef.current && readyRef.current) {
          sendGo();
        }
      }
    };

    const boot = (src: string) => {
      readyRef.current = false;
      uciOkRef.current = false;
      searchingRef.current = false;
      try {
        worker = new Worker(src);
      } catch (e) {
        console.error("Worker Creation Failed:", src, e);
        return false;
      }
      workerRef.current = worker;
      worker.onerror = (err) => {
        err.preventDefault();
        console.error(
          "Stockfish Worker Error:",
          err.message,
          err.filename,
          src,
        );
        clearGoTimer();
        searchingRef.current = false;
        readyRef.current = false;
        worker?.terminate();
        workerRef.current = null;
        if (!stopped) {
          scriptIndex += 1;
          const next = ENGINE_SCRIPTS[scriptIndex];
          if (next) boot(next);
          else setState((prev) => ({ ...prev, isThinking: false }));
        }
      };
      worker.onmessage = (event: MessageEvent) => {
        for (const line of engineLines(event.data)) onLine(line);
      };
      post(worker, "uci");
      return true;
    };

    boot(ENGINE_SCRIPTS[0]!);

    return () => {
      stopped = true;
      clearGoTimer();
      readyRef.current = false;
      uciOkRef.current = false;
      searchingRef.current = false;
      worker?.terminate();
      if (workerRef.current === worker) workerRef.current = null;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [workerGen]);

  const evaluatePosition = useCallback(
    (fen: string, onComplete?: (result: EngineSearchComplete) => void) => {
      const parts = fen.trim().split(/\s+/);
      if (parts.length < 4 || !parts[0]?.includes("/")) return;
      completeCbRef.current = onComplete ?? null;
      fenRef.current = fen;
      pendingGoRef.current = true;
      const w = workerRef.current;
      if (!w || !enabledRef.current) return;
      if (searchingRef.current) {
        post(w, "stop");
        return;
      }
      if (readyRef.current || uciOkRef.current) post(w, "isready");
    },
    [],
  );

  const stop = useCallback(() => {
    if (goTimerRef.current) {
      clearTimeout(goTimerRef.current);
      goTimerRef.current = null;
    }
    pendingGoRef.current = false;
    completeCbRef.current = null;
    if (searchingRef.current) {
      post(workerRef.current, "stop");
    } else {
      setState((prev) => ({ ...prev, isThinking: false }));
    }
  }, []);

  const setOption = useCallback((name: string, value: string) => {
    post(workerRef.current, `setoption name ${name} value ${value}`);
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
      if (searchingRef.current) {
        pendingGoRef.current = true;
        post(w, "stop");
      }
      if (uciOkRef.current) {
        post(w, `setoption name MultiPV value ${settingsRef.current.multiPv}`);
        post(w, "isready");
      }
      if (restart && fenRef.current && enabledRef.current) {
        pendingGoRef.current = true;
      }
      if (patch.hashMb !== undefined) {
        workerRef.current?.terminate();
        workerRef.current = null;
        readyRef.current = false;
        uciOkRef.current = false;
        searchingRef.current = false;
        setWorkerGen((n) => n + 1);
      }
    },
    [],
  );

  const resetEngine = useCallback(() => {
    post(workerRef.current, "stop");
    post(workerRef.current, "ucinewgame");
    searchingRef.current = false;
    pendingGoRef.current = false;
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
  }, []);

  const setEnabled = useCallback((on: boolean) => {
    enabledRef.current = on;
    setEnabledState(on);
    if (!on) {
      pendingGoRef.current = false;
      completeCbRef.current = null;
      if (searchingRef.current) post(workerRef.current, "stop");
      searchingRef.current = false;
      setState((prev) => ({ ...prev, isThinking: false }));
      return;
    }
    if (fenRef.current && workerRef.current) {
      pendingGoRef.current = true;
      if (uciOkRef.current) post(workerRef.current, "isready");
    }
  }, []);

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
