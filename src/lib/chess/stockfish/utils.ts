export function isMobileDevice(): boolean {
    if (typeof navigator === "undefined") return false;
    const iPadOS =
      navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
    return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || iPadOS;
  }
  
  export function engineLines(raw: unknown): string[] {
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
  
  export function post(w: Worker | null, msg: string): boolean {
    if (!w) return false;
    try {
      w.postMessage(msg);
      return true;
    } catch {
      return false;
    }
  }
  
  export function parseScore(line: string, turn: "w" | "b"): number | null {
    const mate = line.match(/score mate (-?\d+)/);
    if (mate) {
      const n = parseInt(mate[1]!, 10);
      const isWhite = turn === "w";
      return n > 0 ? (isWhite ? 100 : -100) : isWhite ? -100 : 100;
    }
    const cp = line.match(/score cp (-?\d+)/);
    if (cp) {
      const rawCp = parseInt(cp[1]!, 10) / 100;
      return turn === "b" ? -rawCp : rawCp;
    }
    return null;
  }