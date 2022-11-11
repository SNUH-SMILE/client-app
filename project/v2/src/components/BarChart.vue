<template>
  <canvas ref="canvas"></canvas>
</template>

<script>
import _merge from 'lodash/merge';

import { BAR_CHART_OPTIONS } from '@/modules/chart';

const STYPE_RGB = ['#3d61ee', '#3cb9f4', '#ff615e', '#ffbc49'];
const STYPE_NM = ['깊은 수면', '얕은 수면', '기상'];

const createChart = (canvas, data, time) => {
  new Chart(canvas, {
    type: 'horizontalBar',
    data: {
      label: ['2021'],
      datasets: data.data,
    },
    options: BAR_CHART_OPTIONS(time),
  });
};

export default {
  name: 'bar-chart',
  components: {},
  props: {
    originData: {
      type: Array,
    },
    totalTime: {
      type: Array,
    },
  },
  mounted() {
    this.drawChart();
  },
  methods: {
    drawChart() {
      const chartData = this.getChartData;
      createChart(this.$refs.canvas, chartData, this.totalTime[0].time);
    },
  },
  computed: {
    getChartData() {
      console.log(this.originData);
      const data = [];
      const labels = [];
      this.originData.forEach((item) => {
        const startTime = this.$dayjs(item.sleepStartDate + ' ' + item.sleepStartTime);
        const endTime = this.$dayjs(item.sleepEndDate + ' ' + item.sleepEndTime);
        const duration = endTime.diff(startTime, 'minute'); // 1440
        labels.push({
          diffSum: duration,
          sleepStartTime: startTime.format('YYYYMMDDHHmm'),
          sleepEndTime: endTime.format('YYYYMMDDHHmm'),
        });
        data.push({
          data: [duration],
          barThickness: 60,
          backgroundColor: STYPE_RGB[Number(item.sleepType)],
          hoverBackgroundColor: STYPE_RGB[Number(item.sleepType)],
        });
      });

      return {
        labels,
        data,
      };
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
