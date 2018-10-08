import App, { BASE_URL } from '../app';
import config from '../../config';

import { tabHandler } from './tabHandler';
import { hideRelayInfo, showRelayInfo } from './relayInfoHandler';
import { ISaveData, ITestData } from '../../lib/types';
import {
  getSessionSettings,
  setSessionSetting,
  getSessionPrices,
} from './sessionStorage';
import { getActiveHoursByCheapest } from '../../lib/activeHours';

const $ = document.querySelector.bind(document);
const $all = document.querySelectorAll.bind(document);

const saveButton = $('#save-relay-btn') as HTMLDivElement;
const testButton = $('#test-relay-btn') as HTMLDivElement;

const relayButtons = Array.from($all(
  '#relay-buttons .button'
) as HTMLButtonElement[]);

const allInputs = Array.from(
  $all('#settings .form input, select')
) as HTMLInputElement[];

class Settings {
  constructor(public app: App) {
    tabHandler();
    this.actionButtonHandler();
    this.relayInfoHandler();
  }

  private actionButtonHandler(): void {
    saveButton.addEventListener('click', this.saveRelay);
    testButton.addEventListener('click', this.testRelay);
  }

  private saveRelay = async () => {
    const values = {} as any;
    const relayID = getSelectedRelayID();
    const activeTab = $('.tab.active') as HTMLDivElement;
    const settingID = activeTab.getAttribute('data-tab') as string;

    const activeInputs = Array.from(
      activeTab.querySelectorAll('select, input')
    ) as HTMLInputElement[];

    for (const input of activeInputs) {
      const inputName = input.getAttribute('id') as string;

      try {
        const parsedValue = parseFloat(input.value);

        if (parsedValue) {
          values[inputName] = parsedValue;
        }
      } catch {
        values[inputName] = input.value;
      }
    }

    const data = { relayID, settingID, values } as ISaveData;

    console.log(data);

    fetch(BASE_URL + '/save', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    await setSessionSetting(data);
    await showRelayInfo(relayID as number);
    resetOtherInputs();
    this.updateChart(relayID as number);
  };

  private async testRelay(): Promise<void> {
    const relayID = getSelectedRelayID();
    const data = { relayID } as ITestData;

    saveButton.classList.add('loading');
    testButton.classList.add('loading');

    await fetch(BASE_URL + '/test', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    setTimeout(() => {
      saveButton.classList.remove('loading');
      testButton.classList.remove('loading');
    }, config.testDuration);
  }

  private relayInfoHandler(): void {
    for (const button of relayButtons) {
      button.addEventListener('click', e => {
        const target = e.target as HTMLDivElement;

        target.classList.contains('basic')
          ? this.selectRelay(target)
          : this.deselectRelay(target);
      });
    }
  }

  updateChart(relayID?: number): void {
    if (!relayID) {
      this.app.chart.removeLimit();
      return;
    }

    const settings = getSessionSettings();

    if (!settings[relayID]) {
      this.app.chart.setActivePoints([]);
      return;
    }

    const relaySettings = settings[relayID];

    // By price
    if (relaySettings[1]) {
      const priceLimit = settings[relayID][1].price as number;
      this.app.chart.setLimit(priceLimit);

      return;
    }

    // By cheapest
    if (relaySettings[2]) {
      const cheapest = relaySettings[2].cheapest as number;
      const prices = getSessionPrices();
      const cheapestHours = getActiveHoursByCheapest(cheapest, prices);

      this.app.chart.setActivePoints(cheapestHours);
      return;
    }
  }

  private selectRelay(target: HTMLDivElement): void {
    const relayID = parseInt(target.getAttribute('data-id') as string);

    relayButtons.map(button => button.classList.add('basic'));
    allInputs.map(input => input.removeAttribute('disabled'));
    target.classList.remove('basic');
    saveButton.classList.remove('disabled');
    testButton.classList.remove('disabled');

    fillFormInputsWithRelaySettings(relayID);
    showRelayInfo(relayID);
    this.updateChart(relayID);
  }

  private deselectRelay(target: HTMLDivElement): void {
    target.classList.add('basic');
    saveButton.classList.add('disabled');
    testButton.classList.add('disabled');

    this.app.chart.removeLimit();
    resetInputs();
    disableInputs();
    hideRelayInfo();
  }
}

function getSelectedRelayID(): number | undefined {
  const activeRelay = $('#relay-buttons div:not(.basic)') as HTMLDivElement;

  if (activeRelay) {
    const relayID = activeRelay.getAttribute('data-id') as string;
    return parseInt(relayID);
  }

  return;
}

function resetInputs(): void {
  allInputs.map(input => (input.value = ''));
}

function resetOtherInputs(): void {
  allInputs.map(input => {
    const tab = input.closest('.tab') as HTMLDivElement;

    if (!tab.classList.contains('active')) {
      input.value = '';
    }
  });
}

function disableInputs(): void {
  allInputs.map(input => input.setAttribute('disabled', ''));
}

function fillFormInputsWithRelaySettings(relayID: number): void {
  const settings = getSessionSettings();
  const relaySettings = settings[relayID.toString()] as object;

  resetInputs();
  if (!relaySettings) return;

  for (const [settingID, values] of Object.entries(relaySettings)) {
    const tabPane = $(`.tab[data-tab="${settingID}"]`) as HTMLDivElement;

    for (const [key, value] of Object.entries(values)) {
      const input = tabPane.querySelector(`#${key}`) as HTMLInputElement;
      input.value = (value || '').toString();
    }
  }
}

export default Settings;
