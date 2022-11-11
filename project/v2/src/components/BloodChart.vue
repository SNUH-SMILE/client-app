<template>
  <canvas ref="canvas"></canvas>
</template>

<script>
import mark1 from '@/assets/img/chart-mark1.svg';
import mark2 from '@/assets/img/chart-mark2.svg';
import { DEFAULT_CHART_OPTIONS } from '@/modules/chart';
const pointCircle = document.createElement('img');
const pointDoubleCircle = document.createElement('img');
pointCircle.setAttribute('alt', '최저혈압');
pointCircle.setAttribute('src', mark1);
pointDoubleCircle.setAttribute('alt', '최고혈압');
pointDoubleCircle.setAttribute('src', mark2);

const bar = (barData) => ({
  type: 'bar',
  // 최저, 최고 데이터 순으로 넣으시면 됩니다.
  data: barData,
  maxBarThickness: 1,
  backgroundColor: '#648ee5',
});

// 최저 데이터 따로
const lowPressure = (lowData) => ({
  type: 'line',
  data: lowData,
  fill: false,
  pointStyle: pointCircle,
  pointHoverStyle: pointCircle,
  showLine: false,
  pointBackgroundColor: '#fff',
  pointHoverBackgroundColor: '#fff',
  pointBorderColor: '#608ae4',
  pointRadius: 5.7,
  pointHoverRadius: 5.7,
});

// 최고 데이터 따로
const highPressure = (highData) => ({
  type: 'line',
  data: highData,
  fill: false,
  pointStyle: pointDoubleCircle,
  pointHoverStyle: pointDoubleCircle,
  showLine: false,
  pointBackgroundColor: '#fff',
  pointHoverBackgroundColor: '#fff',
  pointBorderColor: '#e46060',
  pointRadius: 5.7,
  pointHoverRadius: 5.7,
  spanGaps: true,
});
const getChartData = (origins) => {
  console.log(origins);
  const labels = [];
  const barData = [];
  const lowData = [];
  const highData = [];
  for (const element of origins) {
    labels.push(element.time.substring(0, 2) + ':' + element.time.substring(2, 4));
    barData.push([element.sbp, element.dbp]);
    lowData.push(element.dbp);
    highData.push(element.sbp);
  }
  return {
    labels,
    barData,
    lowData,
    highData,
  };
};

const createChart = (canvas, data) =>
  new Chart(canvas, {
    type: 'line',
    label: 'Line Dataset',
    data: {
      labels: data.labels,
      datasets: [lowPressure(data.lowData), highPressure(data.highData), bar(data.barData)],
    },
    options: DEFAULT_CHART_OPTIONS(),
  });

export default {
  name: 'LineChart',
  components: {},
  props: {
    originData: {
      type: Array,
    },
  },
  mounted() {
    this.drawChart();
  },
  methods: {
    drawChart() {
      const chartData = getChartData(this.originData);
      console.log(chartData);
      const instance = createChart(this.$refs.canvas, chartData);
      console.log(instance);
    },
  },
  watch: {
    originData() {
      this.drawChart();
    },
  },
};
</script>

<style></style>
