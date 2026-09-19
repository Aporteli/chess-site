"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Download, Upload, X } from "lucide-react";
import { useTrainer } from "@/lib/trainer/context";

type LichessStudy = {
  id: string;
  name: string;
  chapterCount: number;
};

function readApiError(data: unknown, fallback: string) {
  if (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof data.error === "string"
  ) {
    return data.error;
  }

  return fallback;
}

function readPgn(data: unknown) {
  if (
    typeof data === "object" &&
    data !== null &&
    "pgn" in data &&
    typeof data.pgn === "string"
  ) {
    return data.pgn;
  }

  return "";
}

export function PgnDialog({
  open,
  mode,
  onClose,
}: {
  open: boolean;
  mode: "import" | "export";
  onClose: () => void;
}) {
  const t = useTrainer();
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const [scope, setScope] = useState<"chapter" | "repertoire">("chapter");
  const [importType, setImportType] = useState<"pgn" | "study">("pgn");
  const [playAs, setPlayAs] = useState<"white" | "black">("white");
  const [username, setUsername] = useState("");
  const [studyId, setStudyId] = useState("");
  const [studies, setStudies] = useState<LichessStudy[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [isListing, setIsListing] = useState(false);

  // Portal მხოლოდ კლიენტზე — SSR-ის დროს document არ არსებობს
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Escape-ით დახურვა
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !mounted) return null;

  const exported =
    scope === "chapter"
      ? t.exportActiveChapter()
      : t.exportActiveRepertoire();

  const importStudyById = async (id: string) => {
    const response = await fetch("/api/repertoire/lichess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        studyId: id,
      }),
    });

    const data: unknown = await response.json();

    if (!response.ok) {
      return { ok: false as const, message: readApiError(data, "Import failed.") };
    }

    const pgn = readPgn(data);

    if (!pgn.trim()) {
      return {
        ok: false as const,
        message: "Import succeeded, but no PGN was returned.",
      };
    }

    return t.importLichessStudy(pgn, playAs);
  };

  const loadStudies = async () => {
    if (!username.trim()) {
      setMessage("Enter a Lichess username.");
      return;
    }

    setIsListing(true);
    setMessage("");

    try {
      const response = await fetch(
        `/api/repertoire/lichess?username=${encodeURIComponent(username.trim())}`,
      );
      const data: unknown = await response.json();

      if (!response.ok) {
        setMessage(readApiError(data, "Could not load studies."));
        return;
      }

      const next =
        typeof data === "object" &&
        data !== null &&
        "studies" in data &&
        Array.isArray(data.studies)
          ? data.studies.flatMap((study) => {
              if (
                typeof study !== "object" ||
                study === null ||
                !("id" in study) ||
                !("name" in study) ||
                typeof study.id !== "string" ||
                typeof study.name !== "string"
              ) {
                return [];
              }

              return [
                {
                  id: study.id,
                  name: study.name,
                  chapterCount:
                    "chapterCount" in study &&
                    typeof study.chapterCount === "number"
                      ? study.chapterCount
                      : 0,
                },
              ];
            })
          : [];

      setStudies(next);
      setMessage(
        next.length
          ? `Found ${next.length} studies.`
          : "No studies found for that username.",
      );
    } catch {
      setMessage("Could not connect to the server.");
    } finally {
      setIsListing(false);
    }
  };

  const importStudy = async (id = studyId) => {
    if (!id.trim()) {
      setMessage("Enter a Study ID or load studies first.");
      return;
    }

    setIsImporting(true);
    setMessage("");

    try {
      const result = await importStudyById(id.trim());
      setMessage(result.message);
      if (result.ok) setTimeout(onClose, 700);
    } catch {
      setMessage("Could not connect to the server.");
    } finally {
      setIsImporting(false);
    }
  };

  const importAllStudies = async () => {
    if (!studies.length) {
      setMessage("Load studies first.");
      return;
    }

    setIsImporting(true);
    setMessage("");

    try {
      let imported = 0;

      for (const study of studies) {
        setMessage(`Importing ${study.name}…`);
        const result = await importStudyById(study.id);

        if (!result.ok) {
          setMessage(`${study.name}: ${result.message}`);
          return;
        }

        imported += 1;
      }

      setMessage(`Imported ${imported} studies.`);
      setTimeout(onClose, 700);
    } catch {
      setMessage("Could not connect to the server.");
    } finally {
      setIsImporting(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl border border-border-default bg-bg-surface shadow-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
          <h2 className="font-mono text-[17px] text-text-primary">
            {mode === "import" ? "Import PGN" : "Export PGN"}
          </h2>

          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-md text-text-muted hover:bg-bg-elevated"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4">
          {mode === "export" ? (
            <>
              <div className="mb-2 flex gap-2">
                <button
                  onClick={() => setScope("chapter")}
                  className="rounded-md px-2 py-1 text-[11px] text-text-muted"
                >
                  This chapter
                </button>

                <button
                  onClick={() => setScope("repertoire")}
                  className="rounded-md px-2 py-1 text-[11px] text-text-muted"
                >
                  Whole repertoire
                </button>
              </div>

              <textarea
                value={exported}
                readOnly
                rows={14}
                className="w-full resize-none rounded-lg border border-border-default bg-bg-elevated p-3 font-mono text-[12px] text-text-primary outline-none"
              />
            </>
          ) : (
            <>
              <div className="mb-3">
                <p className="mb-1.5 font-mono text-[11px] text-text-muted">Who starts first</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPlayAs("white")}
                    className={[
                      "rounded-md px-3 py-1.5 text-[11px]",
                      playAs === "white"
                        ? "bg-accent-gold-dim text-accent-gold-bright"
                        : "text-text-muted",
                    ].join(" ")}
                  >
                    Me (White)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlayAs("black")}
                    className={[
                      "rounded-md px-3 py-1.5 text-[11px]",
                      playAs === "black"
                        ? "bg-accent-gold-dim text-accent-gold-bright"
                        : "text-text-muted",
                    ].join(" ")}
                  >
                    Opponent (I am Black)
                  </button>
                </div>
              </div>

              <div className="mb-3 flex gap-2">
                <button
                  onClick={() => setImportType("pgn")}
                  className={[
                    "rounded-md px-3 py-1.5 text-[11px]",
                    importType === "pgn"
                      ? "bg-accent-gold-dim text-accent-gold-bright"
                      : "text-text-muted",
                  ].join(" ")}
                >
                  PGN
                </button>

                <button
                  onClick={() => setImportType("study")}
                  className={[
                    "rounded-md px-3 py-1.5 text-[11px]",
                    importType === "study"
                      ? "bg-accent-gold-dim text-accent-gold-bright"
                      : "text-text-muted",
                  ].join(" ")}
                >
                  Lichess Study
                </button>
              </div>

              {importType === "study" ? (
                <div className="space-y-2">
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Lichess username"
                    className="w-full rounded-lg border border-border-default bg-bg-elevated px-3 py-2 text-[12px] text-text-primary outline-none"
                  />

                  <input
                    value={studyId}
                    onChange={(e) => setStudyId(e.target.value)}
                    placeholder="Study ID (optional if you load the list)"
                    className="w-full rounded-lg border border-border-default bg-bg-elevated px-3 py-2 text-[12px] text-text-primary outline-none"
                  />

                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={isListing || isImporting}
                      onClick={() => void loadStudies()}
                      className="rounded-lg border border-border-default px-3 py-1.5 text-[12px] text-text-secondary disabled:opacity-60"
                    >
                      {isListing ? "Loading…" : "Load studies"}
                    </button>

                    {studies.length > 0 && (
                      <button
                        type="button"
                        disabled={isImporting}
                        onClick={() => void importAllStudies()}
                        className="rounded-lg border border-border-default px-3 py-1.5 text-[12px] text-text-secondary disabled:opacity-60"
                      >
                        Import all
                      </button>
                    )}
                  </div>

                  {studies.length > 0 && (
                    <div className="max-h-48 overflow-y-auto rounded-lg border border-border-subtle thin-scrollbar">
                      {studies.map((study) => (
                        <div
                          key={study.id}
                          className="flex items-center justify-between gap-2 border-b border-border-subtle px-3 py-2 last:border-b-0"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-[12.5px] text-text-primary">
                              {study.name}
                            </p>
                            <p className="font-mono text-[10px] text-text-muted">
                              {study.chapterCount} chapters
                            </p>
                          </div>
                          <button
                            type="button"
                            disabled={isImporting}
                            onClick={() => void importStudy(study.id)}
                            className="shrink-0 text-[11px] text-accent-gold-bright disabled:opacity-60"
                          >
                            Import
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={14}
                  className="w-full resize-none rounded-lg border border-border-default bg-bg-elevated p-3 font-mono text-[12px] text-text-primary outline-none"
                  placeholder="Paste a PGN with variations, comments, and NAGs…"
                />
              )}

              {message && (
                <p className="mt-2 text-[12px] text-accent-teal-bright">
                  {message}
                </p>
              )}
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-border-subtle px-4 py-3">
          {mode === "import" ? (
            <button
              disabled={isImporting}
              onClick={() => {
                if (importType === "study") {
                  void importStudy();
                  return;
                }

                t.setRepertoireSide(t.repertoire.id, playAs);
                const result = t.importPgnText(text, true);
                setMessage(result.message);

                if (result.ok) setTimeout(onClose, 600);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-b from-accent-gold-bright to-accent-gold px-3 py-2 text-[13px] font-semibold text-[#241a10] disabled:opacity-60"
            >
              <Upload className="h-3.5 w-3.5" />
              {isImporting ? "Importing…" : "Import"}
            </button>
          ) : (
            <button
              onClick={() => {
                void navigator.clipboard.writeText(exported);
                setMessage("Copied to clipboard.");
              }}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-b from-accent-gold-bright to-accent-gold px-3 py-2 text-[13px] font-semibold text-[#241a10]"
            >
              <Download className="h-3.5 w-3.5" />
              Copy PGN
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}