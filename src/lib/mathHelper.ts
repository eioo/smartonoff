export function arrayAverage(arr: Array<number>): number {
  return arr.reduce((a, b) => a + b) / arr.length;
}

export function arrayMedian(arr: Array<number>): number {
  arr = arr.slice(0);

  const middle = (arr.length + 1) / 2;
  const sorted = arr.sort();

  return sorted.length % 2
    ? sorted[middle - 1]
    : (sorted[middle - 1.5] + sorted[middle - 0.5]) / 2;
}
