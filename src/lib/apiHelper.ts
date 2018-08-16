import config from '../../config';

const HOST = `http://${config.apiHost}:${config.apiPort}`;

const endPoints = {
  prices: `${HOST}/prices`,
  settings: `${HOST}/settings`
}

export async function fetchPrices(): Promise<number[]> {
  const response = await fetch(endPoints.prices);
  const prices = await response.json();

  return prices;
}

export async function fetchSettings(): Promise<ISettings> {
  const response = await fetch(endPoints.settings);
  const settings = await response.json();

  return settings;
}