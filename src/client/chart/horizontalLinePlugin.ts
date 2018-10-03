interface IChartExt extends Chart {
  scales: Chart.ChartScales;
  chart: Chart;
  width: number;
}

export interface IChartConfigExt extends Chart.ChartConfiguration {
  lineAtY?: Array<number>;
}

const horizontalLinePlugin = {
  renderHorizontalLine: function(
    chartInstance: IChartExt,
    yPoint: number
  ): void {
    const xAxis = chartInstance.scales['x-axis-0'];
    const yAxis = chartInstance.scales['y-axis-0'];
    const yLinePos = yAxis.getPixelForValue(yPoint);

    // Check if the line is inside the chart area
    if (
      yLinePos > yAxis.getPixelForValue(yAxis.min) ||
      yLinePos < yAxis.getPixelForValue(yAxis.max)
    ) {
      return;
    }

    const ctx = chartInstance.chart.ctx as CanvasRenderingContext2D;

    ctx.beginPath();
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 1;
    ctx.moveTo(xAxis.left, yLinePos);
    ctx.lineTo(xAxis.right, yLinePos);
    ctx.stroke();
  },

  afterDatasetsDraw: function(chart: IChartExt, easing: string): void {
    const config = chart.config as IChartConfigExt;

    if (config.lineAtY) {
      config.lineAtY.forEach(yPoint =>
        this.renderHorizontalLine(chart, yPoint)
      );
    }
  },
};

export default horizontalLinePlugin;
