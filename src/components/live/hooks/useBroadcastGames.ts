'use client';

import { useEffect } from 'react';
import type { BroadcastResponse } from '../types';
import type { BroadcastState } from './useBroadcastState';

export function useBroadcastGames(state: BroadcastState) {
  const {
    games,
    setGames,
    selectedRoundId,
    setSelectedIndex,
    setLoadingGames,
    setStreamConnected,
    setError,
    setIsFollowingLive,
    setMoveIndex,
    selectedGameIdRef,
    gamesRef,
    selectedIndexRef,
    moveIndexRef,
    isFollowingLiveRef,
  } = state;

  /*
   * Load games whenever the selected round changes.
   */

  useEffect(() => {
    const roundId = selectedRoundId;

    if (!roundId) {
      setGames([]);
      gamesRef.current = [];

      setSelectedIndex(0);
      selectedIndexRef.current = 0;

      setMoveIndex(-1);
      moveIndexRef.current = -1;

      return;
    }

    let cancelled = false;

    async function loadGames(id: string) {
      try {
        setLoadingGames(true);
        setStreamConnected(false);
        setError(null);

        setIsFollowingLive(true);
        isFollowingLiveRef.current = true;

        const response = await fetch(
          `/api/lichess/broadcast/round/${encodeURIComponent(id)}/pgn`,
          {
            method: 'GET',
            cache: 'no-store',
          }
        );

        const text = await response.text();

        if (!response.ok) {
          throw new Error(`API ${response.status}: ${text}`);
        }

        const data = JSON.parse(text) as BroadcastResponse;

        if (!Array.isArray(data.games)) {
          throw new Error('API response does not contain games.');
        }

        if (cancelled) {
          return;
        }

        const firstGame = data.games[0];

        setGames(data.games);
        gamesRef.current = data.games;

        setSelectedIndex(0);
        selectedIndexRef.current = 0;

        selectedGameIdRef.current = firstGame?.id ?? null;

        const initialMoveIndex = firstGame ? firstGame.moves.length - 1 : -1;

        setMoveIndex(initialMoveIndex);
        moveIndexRef.current = initialMoveIndex;
      } catch (err) {
        if (cancelled) {
          return;
        }

        setGames([]);
        gamesRef.current = [];

        setSelectedIndex(0);
        selectedIndexRef.current = 0;

        setMoveIndex(-1);
        moveIndexRef.current = -1;

        setError(err instanceof Error ? err.message : 'Failed to load broadcast games.');
      } finally {
        if (!cancelled) {
          setLoadingGames(false);
        }
      }
    }

    void loadGames(roundId);

    return () => {
      cancelled = true;
    };
  }, [
    selectedRoundId,
    setGames,
    setSelectedIndex,
    setLoadingGames,
    setStreamConnected,
    setError,
    setIsFollowingLive,
    setMoveIndex,
    gamesRef,
    selectedIndexRef,
    selectedGameIdRef,
    moveIndexRef,
    isFollowingLiveRef,
  ]);

  /*
   * ONE live stream for the selected round.
   */

  useEffect(() => {
    const roundId = selectedRoundId;

    if (!roundId) {
      return;
    }

    let cancelled = false;
    let controller: AbortController | null = null;
    let pollInterval: ReturnType<typeof setInterval> | null = null;

    async function updateGames(id: string) {
      try {
        const latestResponse = await fetch(
          `/api/lichess/broadcast/round/${encodeURIComponent(id)}/pgn`,
          {
            method: 'GET',
            cache: 'no-store',
          }
        );

        if (!latestResponse.ok) {
          return;
        }

        const latestData = (await latestResponse.json()) as BroadcastResponse;

        if (cancelled || !Array.isArray(latestData.games)) {
          return;
        }

        const currentGameId = selectedGameIdRef.current;
        const currentGames = gamesRef.current;
        const currentSelectedIndex = selectedIndexRef.current;
        const currentMoveIndex = moveIndexRef.current;
        const currentlyFollowingLive = isFollowingLiveRef.current;

        const newSelectedIndex = currentGameId
          ? latestData.games.findIndex((game) => game.id === currentGameId)
          : currentSelectedIndex;

        const finalSelectedIndex = newSelectedIndex >= 0 ? newSelectedIndex : 0;

        const latestGame = latestData.games[finalSelectedIndex];

        const previousGame = currentGameId
          ? currentGames.find((game) => game.id === currentGameId)
          : currentGames[currentSelectedIndex];

        const previousMoveCount = previousGame?.moves.length ?? 0;

        const wasAtLiveEnd =
          currentlyFollowingLive || currentMoveIndex >= previousMoveCount - 1;

        gamesRef.current = latestData.games;
        setGames(latestData.games);

        selectedIndexRef.current = finalSelectedIndex;
        setSelectedIndex(finalSelectedIndex);

        if (!latestGame) {
          return;
        }

        selectedGameIdRef.current = latestGame.id;

        const latestMoveIndex = latestGame.moves.length - 1;

        if (wasAtLiveEnd) {
          moveIndexRef.current = latestMoveIndex;
          setMoveIndex(latestMoveIndex);

          isFollowingLiveRef.current = true;
          setIsFollowingLive(true);
        } else {
          const safeMoveIndex = Math.min(currentMoveIndex, latestMoveIndex);

          moveIndexRef.current = safeMoveIndex;
          setMoveIndex(safeMoveIndex);
        }
      } catch (updateError) {
        if (!cancelled) {
          console.warn('Could not update broadcast games:', updateError);
        }
      }
    }

    async function connectStream(id: string) {
      try {
        controller = new AbortController();

        const response = await fetch(
          `/api/lichess/broadcast/round/${encodeURIComponent(id)}/stream`,
          {
            method: 'GET',
            cache: 'no-store',
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Stream API ${response.status}: ${text}`);
        }

        if (!response.body) {
          throw new Error('Stream response has no body.');
        }

        if (cancelled) {
          return;
        }

        setStreamConnected(true);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (!cancelled) {
          const { value, done } = await reader.read();

          if (done) {
            break;
          }

          if (value) {
            decoder.decode(value, { stream: true });
          }
        }
      } catch (err) {
        if (cancelled || controller?.signal.aborted) {
          return;
        }

        setStreamConnected(false);
        console.error('Broadcast stream error:', err);
      }
    }

    void updateGames(roundId);

    pollInterval = setInterval(() => {
      if (!cancelled) {
        void updateGames(roundId);
      }
    }, 2000);

    void connectStream(roundId);

    return () => {
      cancelled = true;
      controller?.abort();

      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [
    selectedRoundId,
    setGames,
    setSelectedIndex,
    setStreamConnected,
    setIsFollowingLive,
    setMoveIndex,
    gamesRef,
    selectedIndexRef,
    selectedGameIdRef,
    moveIndexRef,
    isFollowingLiveRef,
  ]);

  function selectGame(index: number) {
    const game = games[index];

    if (!game) {
      return;
    }

    selectedGameIdRef.current = game.id;
    selectedIndexRef.current = index;
    setSelectedIndex(index);

    const latestMoveIndex = game.moves.length - 1;

    moveIndexRef.current = latestMoveIndex;
    setMoveIndex(latestMoveIndex);

    setIsFollowingLive(true);
    isFollowingLiveRef.current = true;
  }

  return { selectGame };
}