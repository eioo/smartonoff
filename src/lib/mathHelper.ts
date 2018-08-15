export function getMedian(arr: Array<number>): number {
  const copyArr = arr.slice(0);
  copyArr.sort((a: number, b: number) => a - b);

  const lowMiddle = Math.floor((copyArr.length - 1) / 2);
  const highMiddle = Math.ceil((copyArr.length - 1) / 2);
  const median = (copyArr[lowMiddle] + copyArr[highMiddle]) / 2;

  return median;
}

export function getAverage(arr: Array<number>): number {
  const sum = arr.reduce((previous, current) => current += previous);
  const avg = sum / arr.length;

  return avg;
}
