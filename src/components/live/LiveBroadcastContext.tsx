'use client';

import { createContext, useContext, type ChangeEvent, type ReactNode } from 'react';
import { useBroadcastState, type BroadcastState } from './hooks/useBroadcastState';
import { useBroadcastsLoader } from './hooks/useBroadcastsLoader';
import { useBroadcastGames } from './hooks/useBroadcastGames';

export type LiveBroadcastContextValue = BroadcastState & {
  selectBroadcast: (index: number) => void;
  selectRound: (event: ChangeEvent<HTMLSelectElement>) => void;
  selectGame: (index: number) => void;
};

const LiveBroadcastContext = createContext<LiveBroadcastContextValue | null>(null);

/**
 * Owns the single live broadcast state instance.
 * Must wrap <AppShell> so the navbar and the page share the same state.
 */
export function LiveBroadcastProvider({ children }: { children: ReactNode }) {
  const state = useBroadcastState();
  const { selectBroadcast, selectRound } = useBroadcastsLoader(state);
  const { selectGame } = useBroadcastGames(state);

  return (
    <LiveBroadcastContext.Provider value={{ ...state, selectBroadcast, selectRound, selectGame }}>
      {children}
    </LiveBroadcastContext.Provider>
  );
}

/** For components that render only inside the live route. */
export function useLiveBroadcast(): LiveBroadcastContextValue {
  const value = useContext(LiveBroadcastContext);

  if (!value) {
    throw new Error('useLiveBroadcast must be used within <LiveBroadcastProvider>');
  }

  return value;
}

/** For shared layout components (navbar) that also render on other routes. */
export function useLiveBroadcastOptional(): LiveBroadcastContextValue | null {
  return useContext(LiveBroadcastContext);
}
