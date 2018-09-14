import { getSessionPrices } from '../web/settings/sessionStorage';

export function getActiveHoursByPrice(priceLimit: number): Array<number> {
  const prices = getSessionPrices();

  const activeHours = prices
    .map((price, hour) => {
      return price <= priceLimit ? hour : undefined;
    })
    .filter(price => price);

  return activeHours as Array<number>;
}

export function getActiveHoursByCheapest(cheapestHours: number): Array<number> {
  const prices = getSessionPrices();

  const activeHours = prices
    .map((price, i) => [i, price])
    .sort((a, b) => a[1] - b[1])
    .map(arr => arr[0])
    .slice(0, cheapestHours);

  return activeHours;
}
