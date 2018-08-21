import axios from 'axios';
import * as express from 'express';
import * as cors from 'cors';
import config from '../../config';
import { readSettings, writeSettings } from '../lib/settingsHelper';

const app = express();

app.use(cors());
app.use(express.json());

routeHandler();

app.listen(config.apiPort, () => {
  console.log(`API listening @ http://${config.apiHost}:${config.apiPort}`)
});

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

function routeHandler() {
  app.get('/prices', async (req, res) => {
    const prices = await fetchPrices();
    res.send(JSON.stringify(prices));
  });
  
  app.get('/settings', (req, res) => {
    const settings = readSettings();
    res.send(JSON.stringify(settings));
  });
  
  app.post('/settings/write', (req, res) => {
    writeSettings(req.body);
    res.send('ok');
  });
}
