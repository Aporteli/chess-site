export function formatEval(value: number): string {
  if (Math.abs(value) >= 99) {
    return value > 0 ? 'M' : '−M';
  }

  return value > 0 ? `+${value.toFixed(1)}` : value.toFixed(1);
}
