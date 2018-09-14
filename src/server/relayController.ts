import * as schedule from 'node-schedule';
import logger from './logger';
import { fetchPrices } from './fortum';
import {
  getActiveHoursByCheapest,
  getActiveHoursByPrice,
} from '../lib/activeHours';
import { getSettings } from './settingsIO';
import config from 'config';

const relays = {
  /*   1: new Gpio(12, 'out'),
  2: new Gpio(11, 'out'),
  3: new Gpio(10, 'out'), */
  1: '',
  2: '',
  3: '',
};

let prices: Array<number>;

export async function initialize(): Promise<void> {
  const fetchPriceRule = new schedule.RecurrenceRule();
  const relayStateRule = new schedule.RecurrenceRule();

  fetchPriceRule.hour = 0; // TODO: not 100% sure when the prices update on heydaypro.com
  relayStateRule.minute = 0;

  schedule.scheduleJob(fetchPriceRule, updatePrices);
  schedule.scheduleJob(relayStateRule, updateRelayStates);

  prices = await fetchPrices();

  updateRelayStates();
}

async function updatePrices(): Promise<void> {
  logger.info('Updating prices');
  prices = await fetchPrices();
}

export async function updateRelayStates(): Promise<void> {
  logger.info('Updating relay states');

  const settings = await getSettings();
  const currentHour = new Date().getHours();

  for (const [relayID, relaySettings] of Object.entries(settings)) {
    const conditionID = parseInt(Object.keys(relaySettings)[0]);
    const values = relaySettings[conditionID];

    const activeHours = (() => {
      // By price
      if (conditionID === 1) {
        const priceLimit = values.price as number;
        return getActiveHoursByPrice(priceLimit, prices);
      }

      // By cheapest
      if (conditionID === 2) {
        const cheapestHours = values.cheapest as number;
        return getActiveHoursByCheapest(cheapestHours, prices);
      }

      return [];
    })();

    const newRelayState = activeHours.includes(currentHour);
    setRelayState(parseInt(relayID), newRelayState);
  }
}

function setRelayState(relayID: number, state: boolean): void {
  logger.info(`Relay ${relayID}: ${state ? 'ON' : 'OFF'}`);

  // const relay = relays[relayID];
  // relay.writeSync(state | 0);
}

export function testRelay(relayID: number): void {
  setRelayState(relayID, true);

  setTimeout(() => {
    setRelayState(relayID, false);
  }, config.testDuration);
}
