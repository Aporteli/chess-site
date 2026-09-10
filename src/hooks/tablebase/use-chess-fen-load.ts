import { useState, useCallback } from "react";
import { handlePositionLoaded } from "@/lib/tablebase/chess/scan";

export function useChessFenLoad(sideToMove: "w" | "b", onSuccess: () => void) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const loadFen = useCallback(
    async (fen: string) => {
      if (!fen.trim()) return;
      setBusy(true);
      setMsg(null);
      const ok = await handlePositionLoaded(fen.trim(), sideToMove);
      setBusy(false);
      if (ok) {
        onSuccess();
        return;
      }
      setMsg("Could not load that FEN. Check both kings are present.");
    },
    [sideToMove, onSuccess]
  );

  return { busy, msg, setMsg, loadFen };
}