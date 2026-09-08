"use client";

import { useCallback, useRef, useState } from "react";
import { DEFAULT_LIMITS, DEFAULT_SETTINGS } from "./stockfish/constants";
import { isValidFen, post } from "./stockfish/engine-utils";
import { useStockfishWorker } from "./stockfish/use-stockfish-worker";
import type {
  EngineEvaluation,
  EngineSearchComplete,
  EngineSettingsState,
} from "./stockfish/types";

export type {
  EngineLine,
  EngineSearchComplete,
  EngineSettingsState,
  EngineLimits,
  NnueModel,
} from "./stockfish/types";
export { NNUE_OPTIONS } from "./stockfish/constants";

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
  const completeCbRef = useRef<((result: EngineSearchComplete) => void) | null>(null);
  const enabledRef = useRef(true);
  const goTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [enabled, setEnabledState] = useState(true);
  const [limits, setLimits] = useState(DEFAULT_LIMITS);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
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

  settingsRef.current = settings;

  useStockfishWorker(
    {
      workerRef,
      currentTurnRef,
      fenRef,
      settingsRef,
      readyRef,
      uciOkRef,
      pendingGoRef,
      searchingRef,
      activeFenRef,
      lastUciRef,
      completeCbRef,
      enabledRef,
      goTimerRef,
    },
    {
      setState,
      setSettings,
      setLimits,
      setWorkerGen,
      workerGen,
    },
  );

  const evaluatePosition = useCallback(
    (fen: string, onComplete?: (result: EngineSearchComplete) => void) => {
      if (!isValidFen(fen)) return;

      completeCbRef.current = onComplete ?? null;
      fenRef.current = fen;
      pendingGoRef.current = true;

      const worker = workerRef.current;
      if (!worker || !enabledRef.current) return;

      if (searchingRef.current) {
        post(worker, "stop");
        return;
      }

      if (readyRef.current || uciOkRef.current) {
        post(worker, "isready");
      }
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

      const worker = workerRef.current;
      if (!worker) return;

      if (searchingRef.current) {
        pendingGoRef.current = true;
        post(worker, "stop");
      }

      if (uciOkRef.current) {
        post(worker, `setoption name MultiPV value ${settingsRef.current.multiPv}`);
        post(worker, "isready");
      }

      if (restart && fenRef.current && enabledRef.current) {
        pendingGoRef.current = true;
      }

      if (patch.hashMb !== undefined) {
        worker.terminate();
        workerRef.current = null;
        readyRef.current = false;
        uciOkRef.current = false;
        searchingRef.current = false;
        setWorkerGen((value) => value + 1);
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

      if (searchingRef.current) {
        post(workerRef.current, "stop");
      }

      searchingRef.current = false;
      setState((prev) => ({ ...prev, isThinking: false }));
      return;
    }

    if (fenRef.current && workerRef.current) {
      pendingGoRef.current = true;

      if (uciOkRef.current) {
        post(workerRef.current, "isready");
      }
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
