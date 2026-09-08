export function isMobileDevice() {
  if (typeof navigator === "undefined") return false;

  const iPadOS =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;

  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || iPadOS;
}

export function engineLines(raw: unknown): string[] {
  if (typeof raw === "string") {
    return raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  }

  if (typeof raw === "number" || typeof raw === "boolean") return [];

  if (raw && typeof raw === "object") {
    const value = raw as { data?: unknown; line?: unknown };

    if (typeof value.data === "string") return engineLines(value.data);
    if (typeof value.line === "string") return engineLines(value.line);
  }

  return [];
}

export function post(worker: Worker | null, message: string) {
  if (!worker) return false;

  try {
    worker.postMessage(message);
    return true;
  } catch {
    return false;
  }
}

export function isValidFen(fen: string) {
  const parts = fen.trim().split(/\s+/);
  return parts.length >= 4 && parts[0]?.includes("/");
}
