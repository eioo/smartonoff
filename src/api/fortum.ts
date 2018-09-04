import fetch from 'node-fetch';

export async function fetchPrices() {
  const prices = [];
  const resp = await fetch('https://fortum.heydaypro.com/tarkka/graph.php');
  const data = await resp.text();
  const rows = data.split('data.addRows(')[1].split(']);')[0];
  const regexp = /\[\'\d+\', ([\d\.]+)/g;

  let match;

  while ((match = regexp.exec(rows))) {
    prices.push(parseFloat(match[1]));
  }

  return prices;
}
