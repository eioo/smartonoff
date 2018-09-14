interface IExtendedChart extends Chart {
  scales: Chart.ChartScales;
  chart: Chart;
  width: number;
}

export interface IExtendedChartConfig extends Chart.ChartConfiguration {
  lineAtY?: Array<number>;
}

const horizontalLinePlugin = {
  renderHorizontalLine: function(
    chartInstance: IExtendedChart,
    yPoint: number
  ): void {
    const xAxis = chartInstance.scales['x-axis-0'];
    const yAxis = chartInstance.scales['y-axis-0'];
    const yLinePos = yAxis.getPixelForValue(yPoint);

    const ctx = chartInstance.chart.ctx as CanvasRenderingContext2D;

    ctx.beginPath();
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 1;
    ctx.moveTo(xAxis.left, yLinePos);
    ctx.lineTo(xAxis.right, yLinePos);
    ctx.stroke();

    /* ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
    ctx.fillRect(xAxis.left, yLinePos, xAxis.width, yAxis.bottom - yLinePos);
    ctx.stroke(); */
  },

  afterDatasetsDraw: function(chart: IExtendedChart, easing: string): void {
    const config = chart.config as IExtendedChartConfig;

    if (config.lineAtY) {
      config.lineAtY.forEach(yPoint =>
        this.renderHorizontalLine(chart, yPoint)
      );
    }
  },
};

export default horizontalLinePlugin;
