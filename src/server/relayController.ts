import * as schedule from 'node-schedule';
import logger from './logger';
import { fetchPrices } from './fortum';
import {
  getActiveHoursByCheapest,
  getActiveHoursByPrice,
} from '../lib/activeHours';
import { getSettings } from './settingsIO';
import config from '../../config';
import { Gpio } from 'onoff';

interface IRelays {
  [id: number]: Gpio;
}

const relays: IRelays = {};
let prices: Array<number>;

config.relayGPIO.map((gpio, i) => {
  relays[i + 1] = new Gpio(gpio, 'out');
});

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

function getRelayState(relayID: number): boolean {
  const relay = relays[relayID];
  return !!relay.readSync();
}

function setRelayState(relayID: number, state: boolean): void {
  const startState = getRelayState(relayID);
  const relay = relays[relayID];

  if (startState === state) {
    return;
  }

  startState !== state && relay.writeSync(+state);
  logger.info(`Relay ${relayID}: ${state ? 'ON' : 'OFF'}`);
}

export function testRelay(relayID: number): void {
  const state = getRelayState(relayID);

  setRelayState(relayID, !state);

  setTimeout(() => {
    setRelayState(relayID, state);
  }, config.testDuration);
}
