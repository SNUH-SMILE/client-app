<template>
  <canvas ref="canvas"></canvas>
</template>

<script>
import _merge from 'lodash/merge';
import mark1 from '@/assets/img/chart-mark1.svg';
import mark2 from '@/assets/img/chart-mark2.svg';
import { DEFAULT_CHART_OPTIONS } from '@/modules/chart';
const pointCircle = document.createElement('img');
const pointDoubleCircle = document.createElement('img');
pointCircle.setAttribute('alt', '최저혈압');
pointCircle.setAttribute('src', mark1);
pointDoubleCircle.setAttribute('alt', '최고혈압');
pointDoubleCircle.setAttribute('src', mark2);

const lineData = (data) => ({
  type: 'line',
  data: data,
  fill: false,
  pointStyle: pointCircle,
  pointHoverStyle: pointCircle,
  showLine: true,
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
  const value = [];
  for (const element of origins) {
    labels.push(element.time.substring(0, 2) + ':' + element.time.substring(2, 4));
    value.push(element.value);
  }
  return {
    labels,
    value,
  };
};

const createChart = (canvas, data, options) =>
  new Chart(canvas, {
    type: 'line',
    label: 'Line Dataset',
    data: {
      labels: data.labels,
      datasets: [lineData(data.value)],
    },
    options: _merge(DEFAULT_CHART_OPTIONS(), options),
  });

export default {
  name: 'LineChart',
  components: {},
  props: {
    originData: {
      type: Array,
    },
    options: {
      type: Object,
      default: () => {},
    },
  },
  mounted() {
    this.drawChart();
  },
  methods: {
    drawChart() {
      const chartData = getChartData(this.originData);
      console.log(chartData);
      const instance = createChart(this.$refs.canvas, chartData, this.options);
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
