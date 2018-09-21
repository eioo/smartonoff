import { Chart } from 'chart.js';
import chartConfig from './config';
import horizontalLinePlugin from './horizontalLinePlugin';
import { arrayAverage, arrayMedian } from '../../lib/math';
import App from '../app';

const ACTIVE_COLOR = 'red';
const PASSIVE_COLOR = 'rgba(75,192,192,1)';

const $ = document.querySelector.bind(document);

const highest = $('#infobox #highest') as HTMLDivElement;
const lowest = $('#infobox #lowest') as HTMLDivElement;
const average = $('#infobox #average') as HTMLDivElement;
const median = $('#infobox #median') as HTMLDivElement;

class PriceChart {
  chart: Chart;

  constructor(public app: App) {
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

  private getChartData(): Array<number> {
    const { chart } = this;
    return ((chart.data &&
      chart.data.datasets &&
      chart.data.datasets[0].data) ||
      []) as Array<number>;
  }

  private setPointColors(colors: Array<string>): void {
    chartConfig.data!.datasets![0].borderColor = colors;
    chartConfig.data!.datasets![0].backgroundColor = colors;
    chartConfig.data!.datasets![0].pointBackgroundColor = colors;
    chartConfig.data!.datasets![0].pointBorderColor = colors;
    chartConfig.data!.datasets![0].pointHoverBackgroundColor = colors;
    this.chart.update();
  }

  setLimit(limit: number): void {
    const data = this.getChartData();
    const pointColors = data.map(point => {
      return point <= limit ? ACTIVE_COLOR : PASSIVE_COLOR;
    });

    chartConfig.lineAtY = [limit];
    this.setPointColors(pointColors);
  }

  removeLimit(): void {
    const data = this.getChartData();
    const pointColors = new Array(data.length).fill(PASSIVE_COLOR);

    chartConfig.lineAtY = [];
    this.setPointColors(pointColors);
  }

  setActivePoints(indexes: Array<number>): void {
    const data = this.getChartData();

    const pointColors = data.map((point, index) => {
      return indexes.includes(index) ? ACTIVE_COLOR : PASSIVE_COLOR;
    });

    this.removeLimit();
    this.setPointColors(pointColors);
  }
}

export default PriceChart;
