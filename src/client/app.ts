import config from '../config';
import PriceChart from './chart';
import Settings from './settings';
import { ISettings } from '../lib/types';

export const BASE_URL = `http://${config.host}:${config.port}`;
const loader = document.querySelector('#chart #loading') as HTMLDivElement;

class App {
  chart: PriceChart;
  settings: Settings;

  constructor() {
    this.chart = new PriceChart(this);
    this.settings = new Settings(this);

    this.fetchPrices();
    this.fetchSettings();
  }

  async fetchPrices(): Promise<void> {
    loader.style.display = 'block';

    const res = await fetch(BASE_URL + '/prices');
    const prices = (await res.json()) as Array<number>;

    if (!prices.length) return;

    sessionStorage.setItem('prices', JSON.stringify(prices));
    this.chart.setData(prices);
    loader.style.display = 'none';
  }

  async fetchSettings(): Promise<void> {
    const res = await fetch(BASE_URL + '/settings');
    const settings = (await res.json()) as ISettings;

    sessionStorage.setItem('settings', JSON.stringify(settings));
  }
}

new App();
export default App;
