import fetch from 'node-fetch';

const PRICES_URL = 'https://fortum.heydaypro.com/tarkka/graph.php';

export async function fetchPrices(): Promise<number[]> {
  const prices = [];

  const data = await (async () => {
    try {
      const resp = await fetch(PRICES_URL);
      return await resp.text();
    } catch (e) {
      console.log('API: Error! Could not fetch prices.');
      return '';
    }
  })();

  if (!data) {
    return [];
  }

  const rows = data.split('data.addRows(')[1].split(']);')[0];
  const regexp = /\[\'\d+\', ([\d\.]+)/g;

  let match;

  while ((match = regexp.exec(rows))) {
    prices.push(parseFloat(match[1]));
  }

  return prices;
}
