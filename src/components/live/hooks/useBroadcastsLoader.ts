'use client';

import { useEffect, type ChangeEvent } from 'react';
import type { BroadcastListResponse } from '../types';
import { normalizeBroadcasts } from '../utils';
import type { BroadcastState } from './useBroadcastState';

export function useBroadcastsLoader(state: BroadcastState) {
  const {
    broadcasts,
    setBroadcasts,
    setSelectedBroadcastIndex,
    setSelectedRoundId,
    setLoadingBroadcasts,
    setError,
    setIsFollowingLive,
    isFollowingLiveRef,
  } = state;

  /*
   * Load available Lichess broadcasts automatically.
   */

  useEffect(() => {
    let cancelled = false;

    async function loadBroadcasts() {
      try {
        setLoadingBroadcasts(true);
        setError(null);

        const response = await fetch('/api/lichess/broadcast', {
          method: 'GET',
          cache: 'no-store',
        });

        const text = await response.text();

        if (!response.ok) {
          throw new Error(`Broadcast API ${response.status}: ${text}`);
        }

        const data = JSON.parse(text) as BroadcastListResponse;

        if (!Array.isArray(data.broadcasts)) {
          throw new Error('Broadcast API response does not contain broadcasts.');
        }

        if (cancelled) {
          return;
        }

        const result = normalizeBroadcasts(data.broadcasts);

        setBroadcasts(result);

        if (result.length > 0) {
          const firstBroadcast = result[0];

          setSelectedBroadcastIndex(0);

          const defaultRound = firstBroadcast.rounds.find(
            (round) => round.id === firstBroadcast.defaultRoundId
          );

          const firstRound = defaultRound ?? firstBroadcast.rounds[0];

          setSelectedRoundId(firstRound?.id ?? null);
        } else {
          setSelectedRoundId(null);
        }
      } catch (err) {
        if (cancelled) {
          return;
        }

        setError(err instanceof Error ? err.message : 'Failed to load broadcasts.');
      } finally {
        if (!cancelled) {
          setLoadingBroadcasts(false);
        }
      }
    }

    void loadBroadcasts();

    return () => {
      cancelled = true;
    };
  }, [
    setBroadcasts,
    setSelectedBroadcastIndex,
    setSelectedRoundId,
    setLoadingBroadcasts,
    setError,
  ]);

  function selectBroadcast(index: number) {
    const broadcast = broadcasts[index];

    if (!broadcast) {
      return;
    }

    setSelectedBroadcastIndex(index);

    const defaultRound = broadcast.rounds.find(
      (round) => round.id === broadcast.defaultRoundId
    );

    const firstRound = defaultRound ?? broadcast.rounds[0];

    setSelectedRoundId(firstRound?.id ?? null);

    setIsFollowingLive(true);
    isFollowingLiveRef.current = true;
  }

  function selectRound(event: ChangeEvent<HTMLSelectElement>) {
    const roundId = event.target.value;

    setSelectedRoundId(roundId || null);

    setIsFollowingLive(true);
    isFollowingLiveRef.current = true;
  }

  return { selectBroadcast, selectRound };
}