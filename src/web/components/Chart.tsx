import React, { Component } from 'react';
import { Segment, Header, Loader } from 'semantic-ui-react';
import { Line } from 'react-chartjs-2';
import { ChartOptions, ChartData, ChartTooltipItem, ChartTooltipOptions } from 'chart.js';
import config from '../../../config';

interface IChartState {
  chartVisible: boolean;
  data: ChartData;
  options: ChartOptions;
};

class Chart extends Component<{}, IChartState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      chartVisible: false,
      data: {
        labels: Array.from(Array(24).keys()).map(x => x.toString()),
        datasets: [
          {
            label: 'Sähkön hinta',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 4,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'c/kWh'
            },
            ticks: {
              beginAtZero: true,
              max: 10,
              min: 0
            }
          }],
          xAxes: [{
            gridLines: {
              display: false
            },
            scaleLabel: {
              display: true,
              labelString: 'Kellonaika'
            },
            ticks: {
              autoSkip: false,
            }
          }]
        },
        tooltips: {
          custom: (tooltipOptions: ChartTooltipOptions) => {
            if (!tooltipOptions) return;
            tooltipOptions.displayColors = false;
          },
          callbacks: {
            label: (tooltipItem: ChartTooltipItem) => tooltipItem.yLabel + ' snt/kWh',
            title: (tooltipItem: ChartTooltipItem[]) => ''
          }
        }
      }
    };
  }
  
  updateChartData(newData: Array<number>) {
    const copyData = Object.assign({}, this.state.data);
    const copyOptions = Object.assign({}, this.state.options) as ChartOptions;

    if (!copyData.datasets) return;
    if (!copyOptions.scales ||
        !copyOptions.scales.yAxes ||
        !copyOptions.scales.yAxes[0].ticks) return;

    copyData.datasets[0].data = newData;
    copyOptions.scales.yAxes[0].ticks = {
      ...copyOptions.scales.yAxes[0].ticks,
      max: Math.ceil(Math.max(...newData)) + 1
    };
    
    this.setState({
      data: copyData,
      options: copyOptions
    });
  }

  async fetchPrices() {
    this.setState({
      chartVisible: false
    });

    const endPoint = `http://localhost:${config.apiPort}/prices`;
    const response = await fetch(endPoint);
    const prices = await response.json();

    this.updateChartData(prices);

    this.setState({
      chartVisible: true
    });
  }

  componentDidMount() {
    this.fetchPrices();
  }

  render() {
    return (
      <Segment>
        <Header as='h3' style={{ margin: '5px 0px 15px 5px' }}>Smart On/Off</Header>

        <Loader active={!this.state.chartVisible} size='huge' />
        <div style={{ display: (this.state.chartVisible ? 'block' : 'none') }}>
          <Line data={this.state.data} options={this.state.options} />
        </div>
      </Segment>
    );
  }
}

export default Chart;