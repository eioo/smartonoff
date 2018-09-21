export function getActiveHoursByPrice(
  priceLimit: number,
  prices: Array<number>
): Array<number> {
  const activeHours = prices
    .map((price, hour) => {
      return price <= priceLimit ? hour : undefined;
    })
    .filter(price => price !== undefined);

  return activeHours as Array<number>;
}

export function getActiveHoursByCheapest(
  cheapestHours: number,
  prices: Array<number>
): Array<number> {
  const activeHours = prices
    .map((price, i) => [i, price])
    .sort((a, b) => a[1] - b[1])
    .map(arr => arr[0])
    .slice(0, cheapestHours)
    .sort((a, b) => a - b);

  return activeHours;
}
