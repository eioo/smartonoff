import { tabHandler } from './tabHandler';
import { hideRelayInfo, showRelayInfo } from './relayInfoHandler';
import { ISaveData } from '../../lib/types';
import { getSessionSettings, setSessionSetting } from './sessionStorage';

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

export function eventHandler(): void {
  tabHandler();
  actionButtonHandler();
  relayInfoHandler();
}

function actionButtonHandler(): void {
  saveButton.addEventListener('click', saveRelay);
  testButton.addEventListener('click', testRelay);
}

function saveRelay(): void {
  const values = {};

  const relayID = getSelectedRelayID();
  const activeTab = $('.tab.active') as HTMLDivElement;
  const settingID = activeTab.getAttribute('data-tab');

  const activeInputs = Array.from(
    activeTab.querySelectorAll('select, input')
  ) as HTMLInputElement[];

  for (const input of activeInputs) {
    const inputName = input.getAttribute('id') as string;

    try {
      values[inputName] = parseFloat(input.value);
    } catch (e) {
      values[inputName] = input.value;
    }
  }

  const data = { relayID, settingID, values } as ISaveData;

  fetch('http://localhost:9999/save', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  setSessionSetting(data);
  resetOtherInputs();
  showRelayInfo(relayID as number);
}

function testRelay(): void {
  testButton.classList.add('loading');

  setTimeout(() => {
    testButton.classList.remove('loading');
  }, 2000);
}

function getSelectedRelayID(): number | undefined {
  const activeRelay = $('#relay-buttons div:not(.basic)') as HTMLDivElement;

  if (activeRelay) {
    const relayID = activeRelay.getAttribute('data-id') as string;
    return parseInt(relayID);
  }

  return;
}

function relayInfoHandler(): void {
  for (const button of relayButtons) {
    button.addEventListener('click', e => {
      const target = e.target as HTMLDivElement;

      target.classList.contains('basic')
        ? selectRelay(target)
        : deselectRelay(target);
    });
  }
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

function selectRelay(target: HTMLDivElement): void {
  const relayID = parseInt(target.getAttribute('data-id') as string);

  relayButtons.map(button => button.classList.add('basic'));
  allInputs.map(input => input.removeAttribute('disabled'));
  target.classList.remove('basic');
  saveButton.classList.remove('disabled');
  testButton.classList.remove('disabled');

  fillFormInputsWithRelaySettings(relayID);
  showRelayInfo(relayID);
}

function deselectRelay(target: HTMLDivElement): void {
  target.classList.add('basic');
  saveButton.classList.add('disabled');
  testButton.classList.add('disabled');

  resetInputs();
  disableInputs();
  hideRelayInfo();
}
