import { Chart } from 'chart.js';
import chartConfig from './config';
import horizontalLinePlugin from './horizontalLinePlugin';
import { arrayAverage, arrayMedian } from '../../lib/math';

const $ = document.querySelector.bind(document);

const highest = $('#infobox #highest') as HTMLDivElement;
const lowest = $('#infobox #lowest') as HTMLDivElement;
const average = $('#infobox #average') as HTMLDivElement;
const median = $('#infobox #median') as HTMLDivElement;

class PriceChart {
  chart: Chart;

  constructor() {
    Chart.plugins.register(horizontalLinePlugin);
    this.create();
  }

  async create(): Promise<void> {
    const canvas = $('#chart > canvas') as HTMLCanvasElement;
    this.chart = new Chart(canvas, chartConfig);
  }

  setData(data: Array<number>): void {
    const { chart } = this;
    const { config } = chart;

    const dataset = config.data!.datasets![0];
    dataset.data = data;

    const ticks = config.options!.scales!.yAxes![0].ticks!;
    ticks.max = Math.ceil(Math.max(...data)) + 1;
    ticks.min = Math.floor(Math.min(...data)) - 1;

    highest.innerHTML = Math.max(...data).toFixed(2);
    lowest.innerHTML = Math.min(...data).toFixed(2);
    average.innerHTML = arrayAverage(data).toFixed(2);
    median.innerHTML = arrayMedian(data).toFixed(2);

    chart.update();
  }

  getChartData(): Array<number> {
    const { chart } = this;
    return ((chart.data &&
      chart.data.datasets &&
      chart.data.datasets[0].data) ||
      []) as Array<number>;
  }

  setLimit(limit: number): void {
    const data = this.getChartData();
    chartConfig.lineAtY = [8];

    const pointColors = data.map(point => {
      return point >= limit ? 'red' : 'rgba(75,192,192,1)';
    });

    chartConfig.data!.datasets![0].pointBorderColor = pointColors;
    chartConfig.data!.datasets![0].pointHoverBackgroundColor = pointColors;
    this.chart.update();
  }
}

export default PriceChart;
