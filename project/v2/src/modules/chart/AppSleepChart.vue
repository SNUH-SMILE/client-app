<template>
  <canvas ref="canvas" />
</template>

<script>
import { INIT_SLEEP_DATASETS, INIT_SLEEP_OPTIONS } from '@/modules/chart/sleep';
export default {
  props: ['datas'],
  mounted() {
    this.chart = new Chart(this.$refs.canvas, {
      type: 'horizontalBar',
      data: {
        labels: ['sleep'],
        datasets: this.datas,
      },
      options: INIT_SLEEP_OPTIONS(),
    });
  },
  watch: {
    datas(newVal) {
      this.chart.data.datasets = this.datas;
      this.chart.update();
    },
  },
  beforeDestroy() {
    this.chart.destroy();
  },
};
</script>
