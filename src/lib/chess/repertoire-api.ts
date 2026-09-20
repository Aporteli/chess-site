import { toClientRepertoire } from "@/lib/repertoire-map";
import type { Repertoire } from "./types";

async function readError(response: Response, fallback: string): Promise<string> {
  const data: unknown = await response.json().catch(() => null);
  if (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof (data as { error: unknown }).error === "string"
  ) {
    return (data as { error: string }).error;
  }
  return fallback;
}

export async function fetchRepertoires(): Promise<Repertoire[]> {
  const response = await fetch("/api/repertoire");
  if (!response.ok) {
    throw new Error(await readError(response, "Failed to load repertoires."));
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data)) return [];
  return data.map((row) => toClientRepertoire(row as Parameters<typeof toClientRepertoire>[0]));
}

export async function createRepertoireOnServer(repertoire: Repertoire): Promise<Repertoire> {
  const response = await fetch("/api/repertoire", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(repertoire),
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Failed to create repertoire."));
  }

  const data: unknown = await response.json();
  return toClientRepertoire(data as Parameters<typeof toClientRepertoire>[0]);
}

export async function putRepertoireOnServer(repertoire: Repertoire): Promise<void> {
  const response = await fetch(`/api/repertoire/${encodeURIComponent(repertoire.id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(repertoire),
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Failed to save repertoire."));
  }
}

export async function deleteRepertoiresOnServer(ids: string[]): Promise<void> {
  if (ids.length === 0) return;

  const response = await fetch("/api/repertoire", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Failed to delete repertoires."));
  }
}
