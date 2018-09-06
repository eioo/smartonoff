const relayinfo = document.querySelector('#relayinfo') as HTMLDivElement;

const noneSelected = relayinfo.querySelector('#none') as HTMLDivElement;
const relaySelected = relayinfo.querySelector('#selected') as HTMLDivElement;

const idElement = relayinfo.querySelector('#relayID') as HTMLDivElement;
const condition = relayinfo.querySelector('#condition') as HTMLDivElement;
const activeHoursElement = relayinfo.querySelector(
  '#activehours'
) as HTMLDivElement;

const activeHours = [1, 2, 3];

export function hideRelayInfo(): void {
  noneSelected.style.display = 'block';
  relaySelected.style.display = 'none';
}

export function showRelayInfo(relayID: number): void {
  idElement.innerHTML = relayID.toString();
  condition.innerHTML = 'JOKU';
  activeHoursElement.innerHTML = activeHours
    .map(hour => `<div class="ui label">${hour}</div>`)
    .join('\n');

  noneSelected.style.display = 'none';
  relaySelected.style.display = 'block';
}
