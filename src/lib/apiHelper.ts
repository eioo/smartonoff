import config from '../../config';

const endPoints = {
  prices: `http://${config.apiHost}:${config.apiPort}/prices`
}

export async function fetchPrices(): Promise<number[]> {
  const response = await fetch(endPoints.prices);
  const prices = await response.json();

  return prices;
}