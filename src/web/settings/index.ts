import { tabHandler } from './tabHandler';
import { hideRelayInfo, showRelayInfo } from './relayInfoHandler';
import { ISaveData } from '../../lib/types';

const saveButton = document.querySelector('#save-relay-btn') as HTMLDivElement;
const testButton = document.querySelector('#test-relay-btn') as HTMLDivElement;

const relayButtons = Array.from(document.querySelectorAll(
  '#relay-buttons .button'
) as NodeListOf<Element>);

const inputs = Array.from(
  document.querySelectorAll('#settings .form input, select')
) as HTMLInputElement[];

export function eventHandler(): void {
  tabHandler();
  actionButtonHandler();
  relayInfoHandler();
}

function actionButtonHandler(): void {
  saveButton.addEventListener('click', () => {
    // TODO
    const activeTab = document.querySelector('.tab.active') as HTMLDivElement;
    const settingName = activeTab.getAttribute('data-name');
    const inputs = Array.from(activeTab.querySelectorAll('input, select'));
    const values = {};

    for (const input of inputs as HTMLInputElement[]) {
      const inputName = input.getAttribute('id') as string;
      try {
        values[inputName] = parseFloat(input.value);
      } catch (e) {
        values[inputName] = input.value;
      }
    }

    const data = {
      relayID: getSelectedRelayID(),
      settingName,
      values,
    } as ISaveData;

    fetch('http://localhost:9999/save', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  });

  testButton.addEventListener('click', () => {
    console.log('fuccken tested');
  });
}

function getSelectedRelayID(): number | undefined {
  const activeRelay = document.querySelector(
    '#relay-buttons div:not(.basic)'
  ) as HTMLDivElement;

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

function selectRelay(target: HTMLDivElement): void {
  const relayID = parseInt(target.getAttribute('data-id') as string);

  relayButtons.map(button => button.classList.add('basic'));
  inputs.map(input => input.removeAttribute('disabled'));
  target.classList.remove('basic');
  saveButton.classList.remove('disabled');
  testButton.classList.remove('disabled');

  showRelayInfo(relayID);
}

function deselectRelay(target: HTMLDivElement): void {
  inputs.map(input => {
    input.setAttribute('disabled', '');
    input.value = '';
  });
  target.classList.add('basic');
  saveButton.classList.add('disabled');
  testButton.classList.add('disabled');

  hideRelayInfo();
}
