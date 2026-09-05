'use client';

import { createContext, useContext, useEffect, useRef, useState, useCallback, createElement, type ReactNode } from 'react';

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
  if (typeof navigator === 'undefined') return 2;
  return Math.max(1, navigator.hardwareConcurrency || 2);
}

export function useStockfish() {
  const workerRef = useRef<Worker | null>(null);
  const currentTurnRef = useRef<'w' | 'b'>('w');
  const fenRef = useRef<string | null>(null);
  const settingsRef = useRef(DEFAULT_SETTINGS);
  const readyRef = useRef(false);
  const pendingGoRef = useRef(false);
  const enabledRef = useRef(true);
  const [enabled, setEnabledState] = useState(true);

  const [limits] = useState<EngineLimits>(() => ({
    searchTimeMin: 500,
    searchTimeMax: 30000,
    multiPvMax: 5,
    threadsMax: hardwareThreads(),
    hashMin: 16,
    hashMax: 256,
  }));

  const [settings, setSettings] = useState<EngineSettingsState>(() => ({
    ...DEFAULT_SETTINGS,
    threads: Math.min(2, hardwareThreads()),
  }));
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

  const applyOptions = useCallback(() => {
    const w = workerRef.current;
    if (!w) return;
    const s = settingsRef.current;
    const nnue = NNUE_UCI[s.nnueModel];
    w.postMessage(`setoption name MultiPV value ${s.multiPv}`);
    w.postMessage(`setoption name Threads value ${s.threads}`);
    w.postMessage(`setoption name Hash value ${s.hashMb}`);
    w.postMessage(`setoption name Use NNUE value ${nnue.useNnue}`);
    if (nnue.evalFile) w.postMessage(`setoption name EvalFile value ${nnue.evalFile}`);
    w.postMessage('isready');
  }, []);

  const sendGo = useCallback(() => {
    const w = workerRef.current;
    const fen = fenRef.current;
    if (!w || !fen || !enabledRef.current) return;
    const turn = (fen.split(' ')[1] || 'w') as 'w' | 'b';
    currentTurnRef.current = turn;
    setState((prev) => ({
      ...prev,
      isThinking: true,
    }));
    w.postMessage(`setoption name MultiPV value ${settingsRef.current.multiPv}`);
    w.postMessage(`position fen ${fen}`);
    w.postMessage(`go movetime ${settingsRef.current.searchTimeMs}`);
  }, []);

  useEffect(() => {
    const worker = new Worker('/stockfish.wasm.js');
    workerRef.current = worker;

    worker.onmessage = (event: MessageEvent) => {
      const line = typeof event.data === 'string' ? event.data : '';

      if (line === 'readyok') {
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
          const isWhite = currentTurnRef.current === 'w';
          return n > 0 ? (isWhite ? 100 : -100) : (isWhite ? -100 : 100);
        }
        const cp = line.match(/score cp (-?\d+)/);
        if (cp) {
          const raw = parseInt(cp[1], 10) / 100;
          return currentTurnRef.current === 'b' ? -raw : raw;
        }
        return null;
      };

      if (line.startsWith('info') && line.includes(' pv ')) {
        const score = parseScore();
        const pvMatch = line.match(/ pv (.+)$/);
        const mpv = Number(line.match(/multipv (\d+)/)?.[1] ?? 1);
        const depth = Number(line.match(/\bdepth (\d+)/)?.[1] ?? 0);
        const nps = Number(line.match(/\bnps (\d+)/)?.[1] ?? 0);
        const nodes = Number(line.match(/\bnodes (\d+)/)?.[1] ?? 0);
        if (score !== null && pvMatch) {
          const pv = pvMatch[1].trim();
          const uci = pv.split(' ')[0] ?? '';
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

      if (line.startsWith('bestmove')) {
        const move = line.split(' ')[1];
        setState((prev) => ({
          ...prev,
          bestMove: move !== '(none)' ? move : prev.bestMove,
          isThinking: false,
        }));
      }
    };

    worker.postMessage('uci');
    applyOptions();

    return () => {
      worker.terminate();
    };
  }, [applyOptions, sendGo]);

  const evaluatePosition = useCallback((fen: string, _depth?: number) => {
    if (!workerRef.current) return;
    fenRef.current = fen;
    if (!enabledRef.current) return;
    workerRef.current.postMessage('stop');
    if (readyRef.current) {
      sendGo();
    } else {
      pendingGoRef.current = true;
      workerRef.current.postMessage('isready');
    }
  }, [sendGo]);

  const stop = useCallback(() => {
    if (!workerRef.current) return;
    pendingGoRef.current = false;
    workerRef.current.postMessage('stop');
    setState((prev) => ({ ...prev, isThinking: false }));
  }, []);

  const setOption = useCallback((name: string, value: string) => {
    workerRef.current?.postMessage(`setoption name ${name} value ${value}`);
  }, []);

  const commitSettings = useCallback((patch: Partial<EngineSettingsState>, restart: boolean) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      settingsRef.current = next;
      return next;
    });
    const w = workerRef.current;
    if (!w) return;
    w.postMessage('stop');
    applyOptions();
    if (restart && fenRef.current && enabledRef.current) {
      pendingGoRef.current = true;
    }
  }, [applyOptions]);

  const resetEngine = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.postMessage('stop');
      workerRef.current.postMessage('ucinewgame');
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

  const setEnabled = useCallback((on: boolean) => {
    enabledRef.current = on;
    setEnabledState(on);
    if (!on) {
      pendingGoRef.current = false;
      workerRef.current?.postMessage('stop');
      setState((prev) => ({ ...prev, isThinking: false }));
      return;
    }
    if (fenRef.current && workerRef.current) {
      pendingGoRef.current = true;
      applyOptions();
    }
  }, [applyOptions]);

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

const StockfishContext = createContext<ReturnType<typeof useStockfish> | null>(null);

export function StockfishProvider({ fen, children }: { fen: string; children: ReactNode }) {
  const engine = useStockfish();

  useEffect(() => {
    engine.evaluatePosition(fen);
  }, [fen, engine.evaluatePosition]);

  return createElement(StockfishContext.Provider, { value: engine }, children);
}

export function useStockfishEngine() {
  const ctx = useContext(StockfishContext);
  if (!ctx) throw new Error('useStockfishEngine must be used within StockfishProvider');
  return ctx;
}
