import * as express from 'express';
import { fetchPrices } from './fortum';
import * as cors from 'cors';

const HOST = 'localhost';
const PORT = '9999';

const app = express();

app.use(cors());

app.use('/prices', async (req, res) => {
  const prices = await fetchPrices();
  res.send(JSON.stringify(prices));
});

app.listen(PORT, () => {
  console.log(`API server listening on: http://${HOST}:${PORT}`);
});
