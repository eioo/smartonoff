import * as express from 'express';
import { fetchPrices } from './fortum';
import { ISaveData, ITestData } from '../lib/types';
import { saveSetting, getSettings } from './settingsIO';
import { testRelay } from './relayController';

export function routes(app: express.Application) {
  app.get('/prices', async (req, res) => {
    const prices = await fetchPrices();
    res.send(JSON.stringify(prices));
  });

  app.get('/settings', async (req, res) => {
    const settings = await getSettings();
    res.send(JSON.stringify(settings));
  });

  app.post('/save', async (req, res) => {
    await saveSetting(req.body as ISaveData);
    res.send('ok');
  });

  app.post('/test', (req, res) => {
    const data = req.body as ITestData;
    testRelay(data.relayID);
    res.send('ok');
  });
}
