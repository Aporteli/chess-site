import { useEffect, useRef } from "react";
import {
  DEFAULT_SETTINGS,
  ENGINE_SCRIPTS,
  PHONE_LIMITS,
  DEFAULT_LIMITS,
} from "./constants";
import { engineLines, isMobileDevice, post } from "./engine-utils";
import { parseEngineInfo } from "./parse-engine-line";
import type {
  EngineEvaluation,
  EngineSearchComplete,
  EngineSettingsState,
} from "./types";

type WorkerRefs = {
  workerRef: React.MutableRefObject<Worker | null>;
  fenRef: React.MutableRefObject<string | null>;
  settingsRef: React.MutableRefObject<EngineSettingsState>;
  enabledRef: React.MutableRefObject<boolean>;
  readyRef: React.MutableRefObject<boolean>;
  uciOkRef: React.MutableRefObject<boolean>;
  pendingGoRef: React.MutableRefObject<boolean>;
  searchingRef: React.MutableRefObject<boolean>;
  activeFenRef: React.MutableRefObject<string | null>;
  lastUciRef: React.MutableRefObject<string | null>;
  currentTurnRef: React.MutableRefObject<"w" | "b">;
  completeCbRef: React.MutableRefObject<((result: EngineSearchComplete) => void) | null>;
  goTimerRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
};

type Actions = {
  setState: React.Dispatch<React.SetStateAction<EngineEvaluation>>;
  setSettings: React.Dispatch<React.SetStateAction<EngineSettingsState>>;
  setLimits: React.Dispatch<React.SetStateAction<typeof DEFAULT_LIMITS>>;
  setWorkerGen: React.Dispatch<React.SetStateAction<number>>;
  workerGen: number;
};

export function useStockfishWorker(refs: WorkerRefs, actions: Actions) {
  const { setState, setSettings, setLimits, workerGen } = actions;
  const {
    workerRef,
    fenRef,
    settingsRef,
    enabledRef,
    readyRef,
    uciOkRef,
    pendingGoRef,
    searchingRef,
    activeFenRef,
    lastUciRef,
    currentTurnRef,
    completeCbRef,
    goTimerRef,
  } = refs;

  useEffect(() => {
    if (!isMobileDevice()) return;

    const next = {
      ...DEFAULT_SETTINGS,
      searchTimeMs: 600,
      hashMb: 8,
    };

    settingsRef.current = next;
    setLimits(PHONE_LIMITS);
    setSettings(next);
  }, [setLimits, setSettings, settingsRef]);

  useEffect(() => {
    let worker: Worker | null = null;
    let scriptIndex = 0;
    let stopped = false;

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

      if (!isCurrent) {
        setState((prev) => ({ ...prev, isThinking: false }));
        return;
      }

      setState((prev) => {
        const resolved = move ?? prev.bestMove ?? lastUciRef.current;

        const lines =
          prev.lines.length > 0 || !resolved
            ? prev.lines
            : [{
                multipv: 1,
                uci: resolved,
                pv: resolved,
                evaluation: prev.evaluation ?? 0,
                depth: prev.depth || 1,
              }];

        return {
          ...prev,
          bestMove: resolved,
          isThinking: false,
          resultFen: fromFen,
          lines,
        };
      });

      const callback = completeCbRef.current;
      completeCbRef.current = null;

      callback?.({
        fen: fromFen ?? "",
        bestMove: move ?? lastUciRef.current,
      });
    };

    const sendGo = () => {
      const currentWorker = workerRef.current;
      const fen = fenRef.current;

      if (
        !currentWorker ||
        !fen ||
        !enabledRef.current ||
        !readyRef.current
      ) {
        return;
      }

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

      const ms = Math.max(
        50,
        Math.round(settingsRef.current.searchTimeMs),
      );

      post(
        currentWorker,
        `setoption name MultiPV value ${settingsRef.current.multiPv}`,
      );
      post(currentWorker, `position fen ${fen}`);
      post(currentWorker, `go movetime ${ms}`);

      clearGoTimer();

      goTimerRef.current = setTimeout(() => {
        goTimerRef.current = null;

        if (!searchingRef.current) return;

        post(currentWorker, "stop");

        goTimerRef.current = setTimeout(() => {
          goTimerRef.current = null;

          if (!searchingRef.current) return;

          finishSearch(lastUciRef.current, activeFenRef.current);

          if (
            pendingGoRef.current &&
            enabledRef.current &&
            readyRef.current
          ) {
            sendGo();
          }
        }, 1500);
      }, ms + 2000);
    };

    const onLine = (line: string) => {
      if (line === "uciok") {
        uciOkRef.current = true;
        post(
          workerRef.current,
          `setoption name MultiPV value ${settingsRef.current.multiPv}`,
        );
        post(workerRef.current, "setoption name Hash value 4");
        post(workerRef.current, "isready");
        return;
      }

      if (line === "readyok") {
        readyRef.current = true;

        if (pendingGoRef.current && !searchingRef.current) {
          sendGo();
        }

        return;
      }

      if (line.startsWith("info")) {
        if (activeFenRef.current !== fenRef.current) return;

        const parsed = parseEngineInfo(line, currentTurnRef.current);
        if (!parsed) return;

        if (parsed.line && parsed.line.multipv === 1) {
          lastUciRef.current = parsed.line.uci;
        }

        setState((prev) => {
          const nextLines = parsed.line
            ? [
                ...prev.lines.filter(
                  (item) => item.multipv !== parsed.line!.multipv,
                ),
                parsed.line,
              ].sort((a, b) => a.multipv - b.multipv)
            : prev.lines;

          return {
            ...prev,
            evaluation:
              parsed.line?.multipv === 1 && parsed.score !== null
                ? parsed.score
                : prev.evaluation,
            bestMove:
              parsed.line?.multipv === 1 && parsed.line.uci
                ? parsed.line.uci
                : prev.bestMove,
            lines: nextLines,
            depth:
              parsed.line?.multipv === 1 && parsed.depth
                ? parsed.depth
                : prev.depth,
            nps: parsed.nps || prev.nps,
            nodes: parsed.nodes || prev.nodes,
          };
        });

        return;
      }

      if (line.startsWith("bestmove")) {
        const completedFen = activeFenRef.current;
        const move = line.split(" ")[1] ?? null;

        if (move && move !== "(none)") {
          lastUciRef.current = move;
        }

        finishSearch(
          move && move !== "(none)" ? move : null,
          completedFen,
        );

        if (
          pendingGoRef.current &&
          enabledRef.current &&
          readyRef.current
        ) {
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
      } catch (error) {
        console.error("Worker Creation Failed:", src, error);
        return false;
      }

      workerRef.current = worker;

      worker.onerror = (error) => {
        error.preventDefault();
        console.error("Stockfish Worker Error:", error.message);

        clearGoTimer();
        searchingRef.current = false;
        readyRef.current = false;

        worker?.terminate();
        workerRef.current = null;

        if (!stopped) {
          scriptIndex += 1;
          const next = ENGINE_SCRIPTS[scriptIndex];

          if (next) {
            boot(next);
          } else {
            setState((prev) => ({ ...prev, isThinking: false }));
          }
        }
      };

      worker.onmessage = (event: MessageEvent) => {
        for (const line of engineLines(event.data)) {
          onLine(line);
        }
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

      if (workerRef.current === worker) {
        workerRef.current = null;
      }
    };
  }, [workerGen, goTimerRef, workerRef, fenRef, settingsRef, enabledRef,
      readyRef, uciOkRef, pendingGoRef, searchingRef, activeFenRef,
      lastUciRef, currentTurnRef, completeCbRef, setState]);
}
