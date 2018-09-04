import PriceChart from './chart';
import * as settings from './settings';

async function main() {
  new PriceChart();
  settings.eventHandler();
}

main();
