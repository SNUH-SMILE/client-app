<template>
  <canvas ref="canvas"></canvas>
</template>

<script>
import { chartDataAdapter } from '@/common/chartService.js';
import { BAR_CHART_OPTIONS } from '@/modules/chart';
const createChart = (type, data, time) => {
  new Chart(this.$refs.canvas, {
    type: 'horizontalBar',
    data: {
      label: ['2021'],
      datasets: data.data,
    },
    options: BAR_CHART_OPTIONS(time),
  });
};

export default {
  name: 'v-chart',
  components: {},
  props: {
    tableData: {
      type: Array,
    },
    type: {
      type: String,
    },
  },
  methods: {
    drawChart() {
      const chartData = chartDataAdapter(this.tableData);
      createChart(this.type, chartData);
    },
  },
  mounted() {
    this.drawChart();
  },
  watch: {
    tableData() {
      this.drawChart();
    },
  },
};
</script>
