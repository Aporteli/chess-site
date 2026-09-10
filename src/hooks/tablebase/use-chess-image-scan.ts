import { useState, useCallback, useRef } from "react";
import { handlePositionLoaded } from "@/lib/tablebase/chess/scan";
import { compressBoardImage } from "@/lib/tablebase/chess/image-compressor";

export function useChessImageScan(sideToMove: "w" | "b", onSuccess: () => void) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const recognizeImage = useCallback(
    async (file: File) => {
      setBusy(true);
      setMsg(null);
      const formData = new FormData();
      formData.append("image", await compressBoardImage(file));

      try {
        const res = await fetch("/api/chess/extract-fen", {
          method: "POST",
          body: formData,
        });
        const data = (await res.json()) as { fen?: string; error?: string };
        if (!res.ok) throw new Error(data.error || "Could not read that image");
        if (!data.fen) throw new Error("No position came back from the scanner");
        
        const ok = await handlePositionLoaded(data.fen, sideToMove);
        if (!ok) throw new Error("That FEN could not be loaded onto the tablebase");
        onSuccess();
      } catch (err) {
        setMsg(err instanceof Error ? err.message : "Recognition failed");
      } finally {
        setBusy(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [sideToMove, onSuccess],
  );

  return { busy, msg, setMsg, fileInputRef, recognizeImage };
}