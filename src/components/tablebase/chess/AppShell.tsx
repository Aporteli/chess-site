"use client";

import { useEffect, useState, type ReactNode } from "react";
import { TablebaseChecker } from "./TablebaseChecker";

function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-bg text-fg">
      <header className="shrink-0 border-b border-border px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-end justify-between gap-4">
          <div>
            <p className="font-mono text-2xs uppercase tracking-[0.18em] text-muted">
              Syzygy drill
            </p>
            <h1 className="font-display text-2xl tracking-tight text-fg sm:text-3xl">
              Endgame Lab
            </h1>
          </div>
          <p className="hidden max-w-xs text-right text-sm text-muted text-pretty sm:block">
            Generate winning endings and play them against perfect tablebase
            defence.
          </p>
        </div>
      </header>
      <main className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col">
        {children}
      </main>
    </div>
  );
}

export function AppShell() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  if (!ready) {
    return (
      <Frame>
        <div className="flex flex-1 items-center justify-center p-8 text-sm text-muted">
          Setting the board…
        </div>
      </Frame>
    );
  }

  return (
    <Frame>
      <TablebaseChecker />
    </Frame>
  );
}
