import { tabHandler } from './tabHandler';

export function eventHandler(): void {
  tabHandler();

  const relayButtons = Array.from(document.querySelectorAll(
    '#relay-buttons .button'
  ) as NodeListOf<HTMLElement>);

  for (const button of relayButtons) {
    button.addEventListener('click', e => {
      const target = e.target as HTMLDivElement;

      // toggle
      if (!target.classList.contains('basic')) {
        target.classList.add('basic');
        updateRelayInfo();
        return;
      }

      relayButtons.map(button => button.classList.add('basic'));
      target.classList.remove('basic');

      const relayID = parseInt(target.getAttribute('data-id') as string);
      updateRelayInfo(relayID);
    });
  }
}

function updateRelayInfo(relayID?: number): void {
  const activeHours = [1, 5, 7, 8, 10, 19]; // temp
  const relayinfo = document.querySelector('#relayinfo') as HTMLDivElement;
  const noneElement = relayinfo.querySelector('#none') as HTMLDivElement;

  const selectedElement = relayinfo.querySelector(
    '#selected'
  ) as HTMLDivElement;

  if (!relayID) {
    noneElement.style.display = 'block';
    selectedElement.style.display = 'none';
    return;
  }

  const idElement = relayinfo.querySelector('#relayID') as HTMLDivElement;
  const condition = relayinfo.querySelector('#condition') as HTMLDivElement;
  const activeHoursElement = relayinfo.querySelector(
    '#activehours'
  ) as HTMLDivElement;

  idElement.innerHTML = relayID.toString();
  condition.innerHTML = 'JOKU';
  activeHoursElement.innerHTML = activeHours
    .map(hour => `<div class="ui label">${hour}</div>`)
    .join('\n');

  noneElement.style.display = 'none';
  selectedElement.style.display = 'block';
}
