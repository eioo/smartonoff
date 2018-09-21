import { IChartConfigExt, IExtendedChartConfig2 } from './horizontalLinePlugin';

const config = {
  type: 'line',
  data: {
    labels: Array.from(Array(24).keys()).map(x => x.toString()),
    datasets: [
      {
        fill: false,
        lineTension: 0.1,
        borderColor: 'rgba(75,192,192,1)',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBorderWidth: 5,
        pointHoverRadius: 5,
        pointHoverBorderWidth: 2,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointRadius: 1,
        pointHitRadius: 20,
      },
    ],
  },
  options: {
    legend: {
      display: false,
    },
    scales: {
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'c/kWh',
          },
          ticks: {
            beginAtZero: true,
            stepSize: 1,
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            display: false,
          },
          scaleLabel: {
            display: true,
            labelString: 'Kellonaika',
          },
          ticks: {
            autoSkip: false,
          },
        },
      ],
    },
    tooltips: {
      custom: tooltipOptions => {
        if (!tooltipOptions) return;
        tooltipOptions.displayColors = false;
      },
      callbacks: {
        label: tooltipItem => {
          const price = parseFloat(tooltipItem.yLabel as string).toFixed(2);
          return `Hinta: ${price} c/kWh`;
        },
        title: tooltipItem => `Kello ${tooltipItem[0].xLabel}:00`,
      },
    },
  },
} as IChartConfigExt;

export default config;
