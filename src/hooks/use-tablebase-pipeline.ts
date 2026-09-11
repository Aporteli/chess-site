import { useState, useRef } from 'react';
import { Chess } from 'chess.js';
import { useStockfish } from '@/lib/chess/stockfish/use-stockfish';
import type { EndgameKind, GameOverReason, PipelineStatus } from '@/lib/tablebase/chess/types';
import { isValidFen, clonePlayed, playMoveSfx } from './tablebase/pipeline/helpers';
import { useTablebaseEngineActions } from './tablebase/pipeline/use-engine-actions';
import { useTablebasePipelineRunner } from './tablebase/pipeline/use-pipeline-runner';

export { isValidFen, clonePlayed, playMoveSfx };

export function useTablebasePipeline(
  selectedKind: EndgameKind,
  humanColor: 'w' | 'b',
  sound: boolean,
  commitFen: (fen: string) => boolean,
  setBoard: (board: Chess) => void,
  board: Chess,
) {
  const [pipeline, setPipeline] = useState<PipelineStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState<GameOverReason | null>(null);
  const [uciHistory, setUciHistory] = useState<string[]>([]);
  const [hintUci, setHintUci] = useState<string | null>(null);

  const fillSeq = useRef(0);
  const hintPending = useRef(false);
  const hintFen = useRef<string | null>(null);
  const replyFen = useRef<string | null>(null);
  const repliedFen = useRef<string | null>(null);
  const engineUciRef = useRef<string | null>(null);
  const soundRef = useRef(sound);
  soundRef.current = sound;

  const building = pipeline !== 'idle';
  const stockfish = useStockfish();
  engineUciRef.current = stockfish.bestMove;

  const engineActions = useTablebaseEngineActions({
    humanColor,
    sound,
    soundRef,
    commitFen,
    board,
    building,
    gameOver,
    setGameOver,
    setUciHistory,
    setHintUci,
    hintPending,
    hintFen,
    replyFen,
    repliedFen,
    enabled: stockfish.enabled,
    evaluatePosition: stockfish.evaluatePosition,
  });

  const pipelineRunner = useTablebasePipelineRunner({
    selectedKind,
    fillSeq,
    haltEngine: engineActions.haltEngine,
    setError,
    setPipeline,
    commitFen,
    evaluatePosition: stockfish.evaluatePosition,
  });

  return {
    pipeline,
    setPipeline,
    error,
    setError,
    gameOver,
    setGameOver,
    uciHistory,
    setUciHistory,
    hintUci,
    setHintUci,
    hintPending,
    hintFen,
    replyFen,
    repliedFen,
    engineUciRef,
    evaluation: stockfish.evaluation,
    isThinking: stockfish.isThinking,
    lines: stockfish.lines,
    depth: stockfish.depth,
    nps: stockfish.nps,
    enabled: stockfish.enabled,
    settings: stockfish.settings,
    commitSettings: stockfish.commitSettings,
    setEnabled: stockfish.setEnabled,
    resultFen: stockfish.resultFen,
    limits: stockfish.limits,
    evaluatePosition: stockfish.evaluatePosition,
    ...engineActions,
    ...pipelineRunner,
  };
}
