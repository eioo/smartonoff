import PriceChart from './chart';
import * as settings from './settings';
import { arrayAverage, arrayMedian } from '../lib/math';

const loader = document.querySelector('#chart #loading') as HTMLDivElement;
const highest = document.querySelector('#infobox #highest') as HTMLDivElement;
const lowest = document.querySelector('#infobox #lowest') as HTMLDivElement;
const average = document.querySelector('#infobox #average') as HTMLDivElement;
const median = document.querySelector('#infobox #median') as HTMLDivElement;

class App {
  chart: PriceChart;

  constructor() {
    settings.eventHandler();
    this.chart = new PriceChart();
    this.fetchPrices();
  }

  async fetchPrices(): Promise<void> {
    loader.style.display = 'block';

    const res = await fetch('http://localhost:9999/prices');
    const prices = (await res.json()) as Array<number>;

    if (!prices.length) {
      return;
    }

    highest.innerHTML = Math.max(...prices).toFixed(2);
    lowest.innerHTML = Math.min(...prices).toFixed(2);
    average.innerHTML = arrayAverage(prices).toFixed(2);
    median.innerHTML = arrayMedian(prices).toFixed(2);

    this.chart.setData(prices);

    loader.style.display = 'none';
  }
}

new App();
