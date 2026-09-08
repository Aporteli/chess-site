import {
    useState,
    useCallback,
    useRef,
    useEffect,
    Dispatch,
    SetStateAction,
  } from "react";
  import { Chess } from "chess.js";
  import type { TablebaseResponse } from "@/app/api/tablebase/route";
  import type { GameOverReason } from "@/components/tablebase/types";
  
  interface BoardStateOptions {
    setResult?: Dispatch<SetStateAction<TablebaseResponse | null>>;
    replyFen?: React.MutableRefObject<string | null>;
    repliedFen?: React.MutableRefObject<string | null>;
    setGameOver?: Dispatch<SetStateAction<GameOverReason | null>>;
    setHintUci?: Dispatch<SetStateAction<string | null>>;
    setError?: Dispatch<SetStateAction<string | null>>;
  }
  
  export function useBoardState(initialFen: string, options?: BoardStateOptions) {
    const [board, setBoard] = useState(() => new Chess(initialFen));
    const [fen, setFen] = useState<string>(initialFen);
    const [fenInput, setFenInput] = useState<string>(initialFen);
    const [fenValid, setFenValid] = useState(true);
    const [uciHistory, setUciHistory] = useState<string[]>([]);
  
    // options-ის Ref-ში შენახვა თავიდან აგაცილებს Stale Closure-ის პრობლემას
    const optionsRef = useRef(options);
    useEffect(() => {
      optionsRef.current = options;
    }, [options]);
  
    const commitFen = useCallback((nextFen: string) => {
      try {
        const next = new Chess(nextFen);
        const opt = optionsRef.current;
  
        if (opt?.replyFen) opt.replyFen.current = null;
        if (opt?.repliedFen) opt.repliedFen.current = null;
  
        setBoard(next);
        setFen(next.fen());
        setFenInput(next.fen());
        setFenValid(true);
        setUciHistory([]);
  
        opt?.setGameOver?.(null);
        opt?.setResult?.(null);
        opt?.setHintUci?.(null);
        opt?.setError?.(null);
  
        return true;
      } catch {
        setFenValid(false);
        return false;
      }
    }, []);
  
    return {
      board,
      fen,
      fenInput,
      fenValid,
      uciHistory,
      setBoard,
      setFenInput,
      setUciHistory,
      commitFen,
      setGameOver: options?.setGameOver,
      setResult: options?.setResult,
      setHintUci: options?.setHintUci,
      setError: options?.setError,
    };
  }