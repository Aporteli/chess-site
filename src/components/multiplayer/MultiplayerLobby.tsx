'use client';

import { useEffect, useState } from 'react';
import { Link2, Search, Swords, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MultiplayerLobbyProps {
  isSearching: boolean;
  error: string | null;
  onFindOpponent: () => void;
  onCancelSearch: () => void;
  onCreateGame: () => void;
}

function formatElapsed(total: number): string {
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function MultiplayerLobby({
  isSearching,
  error,
  onFindOpponent,
  onCancelSearch,
  onCreateGame,
}: MultiplayerLobbyProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isSearching) {
      setElapsed(0);
      return;
    }

    const id = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => window.clearInterval(id);
  }, [isSearching]);

  return (
    <div className="flex min-h-full w-full flex-1 flex-col justify-center px-3 py-6 sm:px-6">
      <div className="mx-auto grid w-full max-w-5xl items-center gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)]">
        <section>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent-gold-bright">Multiplayer</p>
          <h1 className="font-serif-display mt-2 text-4xl leading-none text-text-primary sm:text-5xl">Play a game</h1>
          <p className="mt-3 max-w-md font-mono text-xs leading-relaxed text-text-secondary">
            Unrated, with no clock. Pair with someone online, or send a friend a private link.
          </p>

          {error && (
            <p className="mt-4 rounded-lg border border-accent-garnet/40 bg-accent-garnet-dim px-3 py-2 font-mono text-xs text-accent-garnet-bright">
              {error}
            </p>
          )}

          {isSearching ? (
            <div
              className="mt-6 rounded-2xl border border-border-default bg-bg-surface px-6 py-8 text-center shadow-panel"
              aria-live="polite">
              <span className="relative mx-auto grid h-16 w-16 place-items-center">
                <span className="absolute inset-0 animate-ping rounded-full border border-accent-teal/50" />
                <span className="h-3 w-3 rounded-full bg-accent-teal-bright" />
              </span>
              <h2 className="mt-4 font-mono text-sm text-text-primary">Looking for an opponent</h2>
              <p className="mt-1 font-mono text-2xl tabular-nums text-accent-gold-bright">{formatElapsed(elapsed)}</p>
              <p className="mt-1 font-mono text-xs text-text-muted">You’ll be seated as soon as someone else is searching.</p>
              <button
                type="button"
                onClick={onCancelSearch}
                className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-lg border border-accent-garnet/40 bg-accent-garnet-dim px-3 py-2 font-mono text-xs text-accent-garnet-bright transition hover:border-accent-garnet/70">
                <X className="h-3.5 w-3.5" />
                Cancel search
              </button>
            </div>
          ) : (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <article className="flex flex-col rounded-2xl border border-accent-teal-bright/35 bg-accent-teal-bright/8 p-4 shadow-panel">
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-accent-teal-bright/30 bg-accent-teal-bright/15 text-accent-teal-bright">
                  <Swords className="h-4 w-4" />
                </span>
                <h2 className="mt-3 font-mono text-sm text-text-primary">Quick match</h2>
                <p className="mt-1 flex-1 font-mono text-xs leading-relaxed text-text-muted">
                  Pair with the next player who is looking for a game. Color is assigned when the match is made.
                </p>
                <button
                  type="button"
                  onClick={onFindOpponent}
                  className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-accent-teal-bright px-3 py-2.5 font-mono text-xs text-bg-deepest transition hover:brightness-110">
                  <Search className="h-3.5 w-3.5" />
                  Find opponent
                </button>
              </article>

              <article className="flex flex-col rounded-2xl border border-border-default bg-bg-surface p-4 shadow-panel">
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-border-default bg-bg-elevated text-text-secondary">
                  <Link2 className="h-4 w-4" />
                </span>
                <h2 className="mt-3 font-mono text-sm text-text-primary">Play a friend</h2>
                <p className="mt-1 flex-1 font-mono text-xs leading-relaxed text-text-muted">
                  Open a private room. You play White. Share the link and your friend joins as Black.
                </p>
                <button
                  type="button"
                  onClick={onCreateGame}
                  className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border-default bg-bg-elevated px-3 py-2.5 font-mono text-xs text-text-primary transition hover:border-accent-teal/50 hover:text-accent-gold-bright">
                  <Link2 className="h-3.5 w-3.5" />
                  Create private game
                </button>
              </article>
            </div>
          )}
        </section>

        <aside className="rounded-2xl border border-border-default bg-bg-elevated/60 p-4 lg:self-end">
          <h2 className="font-mono text-[10px] uppercase tracking-wider text-text-muted">At the board</h2>
          <ol className="mt-3 space-y-3">
            {[
              ['Take a seat', 'Quick match uses the first open game. A private room waits on your link.'],
              ['Make a move', 'Drag or click. Your color starts at the bottom, and promotion asks which piece.'],
              ['Leave freely', 'Nothing is rated. Leaving closes the room for you.'],
            ].map(([title, body], index) => (
              <li key={title} className="flex gap-3">
                <span
                  className={cn(
                    'grid h-6 w-6 shrink-0 place-items-center rounded-md border font-mono text-[11px]',
                    'border-border-default bg-bg-elevated text-text-secondary',
                  )}>
                  {index + 1}
                </span>
                <div>
                  <p className="font-mono text-xs text-text-primary">{title}</p>
                  <p className="mt-0.5 font-mono text-xs leading-relaxed text-text-muted">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}
