import fetch from 'node-fetch';
import logger from './logger';

const PRICES_URL = 'https://fortum.heydaypro.com/tarkka/graph.php';

export async function fetchPrices(): Promise<number[]> {
  logger.info('Fetching prices');
  const prices = [];

  const data = await (async () => {
    try {
      const resp = await fetch(PRICES_URL);
      return await resp.text();
    } catch (e) {
      return '';
    }
  })();

  if (!data) {
    logger.error('Could not fetch prices');
    return [];
  }

  const rows = data.split('data.addRows(')[1].split(']);')[0];
  const regexp = /\[\'\d+\', ([\d\.]+)/g;

  let match;

  while ((match = regexp.exec(rows))) {
    prices.push(parseFloat(match[1]));
  }

  logger.success(`Prices fetched`);
  return prices;
}
