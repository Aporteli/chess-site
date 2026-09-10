export function getMoveShare(moveGames: number, totalGames: number): number {
  if (!totalGames) {
    return 0;
  }

  return Math.round((moveGames / totalGames) * 100);
}
