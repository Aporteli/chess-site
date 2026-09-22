'use client';

import type { BroadcastState } from './useBroadcastState';

export function useMoveNavigation(state: BroadcastState) {
  const {
    selectedGame,
    setMoveIndex,
    setIsFollowingLive,
    moveIndexRef,
    isFollowingLiveRef,
  } = state;

  function firstMove() {
    moveIndexRef.current = -1;
    setMoveIndex(-1);

    isFollowingLiveRef.current = false;
    setIsFollowingLive(false);
  }

  function previousMove() {
    const nextIndex = Math.max(-1, moveIndexRef.current - 1);

    moveIndexRef.current = nextIndex;
    setMoveIndex(nextIndex);

    isFollowingLiveRef.current = false;
    setIsFollowingLive(false);
  }

  function nextMove() {
    if (!selectedGame) {
      return;
    }

    const latestMoveIndex = selectedGame.moves.length - 1;
    const nextIndex = Math.min(latestMoveIndex, moveIndexRef.current + 1);

    moveIndexRef.current = nextIndex;
    setMoveIndex(nextIndex);

    const reachedLive = nextIndex >= latestMoveIndex;

    isFollowingLiveRef.current = reachedLive;
    setIsFollowingLive(reachedLive);
  }

  function lastMove() {
    if (!selectedGame) {
      return;
    }

    const latestMoveIndex = selectedGame.moves.length - 1;

    moveIndexRef.current = latestMoveIndex;
    setMoveIndex(latestMoveIndex);

    isFollowingLiveRef.current = true;
    setIsFollowingLive(true);
  }

  function goLive() {
    if (!selectedGame) {
      return;
    }

    const latestMoveIndex = selectedGame.moves.length - 1;

    moveIndexRef.current = latestMoveIndex;
    setMoveIndex(latestMoveIndex);

    isFollowingLiveRef.current = true;
    setIsFollowingLive(true);
  }

  function handleMoveClick(index: number) {
    if (!selectedGame) {
      return;
    }

    setMoveIndex(index);
    moveIndexRef.current = index;

    const atLive = index === selectedGame.moves.length - 1;

    setIsFollowingLive(atLive);
    isFollowingLiveRef.current = atLive;
  }

  return {
    firstMove,
    previousMove,
    nextMove,
    lastMove,
    goLive,
    handleMoveClick,
  };
}