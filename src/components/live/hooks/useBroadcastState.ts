'use client';

import { useEffect, useRef, useState } from 'react';
import type { BroadcastGame, BroadcastItem } from '../types';

export function useBroadcastState() {
  const [broadcasts, setBroadcasts] = useState<BroadcastItem[]>([]);
  const [selectedBroadcastIndex, setSelectedBroadcastIndex] = useState(0);
  const [selectedRoundId, setSelectedRoundId] = useState<string | null>(null);
  const [games, setGames] = useState<BroadcastGame[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [moveIndex, setMoveIndex] = useState(-1);
  const [loadingBroadcasts, setLoadingBroadcasts] = useState(true);
  const [loadingGames, setLoadingGames] = useState(false);
  const [streamConnected, setStreamConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFollowingLive, setIsFollowingLive] = useState(true);

  const selectedGameIdRef = useRef<string | null>(null);
  const gamesRef = useRef<BroadcastGame[]>([]);
  const selectedIndexRef = useRef(0);
  const moveIndexRef = useRef(-1);
  const isFollowingLiveRef = useRef(true);

  const selectedBroadcast = broadcasts[selectedBroadcastIndex];
  const selectedGame = games[selectedIndex];

  /*
   * Keep refs synchronized with React state.
   */

  useEffect(() => {
    selectedGameIdRef.current = selectedGame?.id ?? null;
  }, [selectedGame]);

  useEffect(() => {
    gamesRef.current = games;
  }, [games]);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  useEffect(() => {
    moveIndexRef.current = moveIndex;
  }, [moveIndex]);

  useEffect(() => {
    isFollowingLiveRef.current = isFollowingLive;
  }, [isFollowingLive]);

  return {
    // state
    broadcasts,
    setBroadcasts,
    selectedBroadcastIndex,
    setSelectedBroadcastIndex,
    selectedRoundId,
    setSelectedRoundId,
    games,
    setGames,
    selectedIndex,
    setSelectedIndex,
    moveIndex,
    setMoveIndex,
    loadingBroadcasts,
    setLoadingBroadcasts,
    loadingGames,
    setLoadingGames,
    streamConnected,
    setStreamConnected,
    error,
    setError,
    isFollowingLive,
    setIsFollowingLive,
    // derived
    selectedBroadcast,
    selectedGame,
    // refs
    selectedGameIdRef,
    gamesRef,
    selectedIndexRef,
    moveIndexRef,
    isFollowingLiveRef,
  };
}

export type BroadcastState = ReturnType<typeof useBroadcastState>;