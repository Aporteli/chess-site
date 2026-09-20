import { toClientRepertoire, toClientRepertoireSummary } from "@/lib/repertoire-map";
import type { Side } from "@/lib/types";
import type { Repertoire, RepertoireSummary } from "./types";

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

/** Lightweight index of the user's repertoires — no chapter node trees. */
export async function fetchRepertoireSummaries(): Promise<RepertoireSummary[]> {
  const response = await fetch("/api/repertoire");
  if (!response.ok) {
    throw new Error(await readError(response, "Failed to load repertoires."));
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data)) return [];
  return data.map((row) =>
    toClientRepertoireSummary(row as Parameters<typeof toClientRepertoireSummary>[0]),
  );
}

/** Single repertoire including its chapter trees. */
export async function fetchRepertoire(id: string): Promise<Repertoire> {
  const response = await fetch(`/api/repertoire/${encodeURIComponent(id)}`);
  if (!response.ok) {
    throw new Error(await readError(response, "Failed to load repertoire."));
  }

  const data: unknown = await response.json();
  return toClientRepertoire(data as Parameters<typeof toClientRepertoire>[0]);
}

/** Every repertoire with its chapter trees. Only for views that need library-wide stats. */
export async function fetchRepertoires(): Promise<Repertoire[]> {
  const response = await fetch("/api/repertoire?include=chapters");
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

/** Side-only update; safe for repertoires whose chapter trees are not loaded client-side. */
export async function updateRepertoireSideOnServer(id: string, side: Side): Promise<void> {
  const response = await fetch(`/api/repertoire/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ side }),
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Failed to update repertoire."));
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
