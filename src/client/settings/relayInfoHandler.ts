import { getSessionSettings, getSessionPrices } from './sessionStorage';
import {
  getActiveHoursByCheapest,
  getActiveHoursByPrice,
} from '../../lib/activeHours';

const relayinfo = document.querySelector('#relayinfo') as HTMLDivElement;
const noneSelected = relayinfo.querySelector('#none') as HTMLDivElement;
const relaySelected = relayinfo.querySelector('#selected') as HTMLDivElement;
const idElement = relayinfo.querySelector('#relayID') as HTMLDivElement;
const condition = relayinfo.querySelector('#condition') as HTMLDivElement;
const activeHoursElement = relayinfo.querySelector(
  '#activehours'
) as HTMLDivElement;

export function hideRelayInfo(): void {
  noneSelected.style.display = 'block';
  relaySelected.style.display = 'none';
}

export function showRelayInfo(relayID: number): void {
  const prices = getSessionPrices();
  const settings = getSessionSettings();
  const relaySettings = settings[relayID];

  noneSelected.style.display = 'none';
  relaySelected.style.display = 'block';

  idElement.innerHTML = relayID.toString();

  if (!relaySettings) {
    condition.innerHTML = '-';
    activeHoursElement.innerHTML = '-';

    return;
  }

  const settingID = parseInt(Object.keys(relaySettings)[0]);
  const tabHeader = document.querySelector(
    `.menu .item[data-tab='${settingID}']`
  ) as HTMLDivElement;

  const activeHours = (() => {
    const values = relaySettings[settingID];

    if (settingID === 1) {
      const priceLimit = parseFloat(values.price.toString());
      return getActiveHoursByPrice(priceLimit, prices);
    }

    if (settingID === 2) {
      const cheapestHours = parseInt(values.cheapest.toString());
      return getActiveHoursByCheapest(cheapestHours, prices);
    }

    return [];
  })() as Array<number>;

  const bubbles = activeHours
    .map(hour => `<div class="ui label">${hour}</div>`)
    .join('\n');

  condition.innerHTML = tabHeader.innerHTML;
  activeHoursElement.innerHTML = bubbles || '-';
}
