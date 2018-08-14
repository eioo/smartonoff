import axios from 'axios';
import * as express from 'express';
import * as cors from 'cors';
import config from '../../config';

async function fetchPrices() {
  const response = await axios.get('https://fortum.heydaypro.com/tarkka/graph.php');
  const data = response.data;
  const rows = data.split('data.addRows(')[1].split(']);')[0];
  const re = /\[\'\d+\', ([\d\.]+)/g;

  const prices = [];
  let match;

  while (match = re.exec(rows)) {
    prices.push(parseFloat(match[1]));
  }

  return prices;
}

const app = express();

app.use(cors());

app.get('/prices', async (req, res) => {
  const prices = await fetchPrices();
  res.send(JSON.stringify(prices));
});

app.listen(config.apiPort, () => {
  console.log(`API listening on port ${config.apiPort}`)
});