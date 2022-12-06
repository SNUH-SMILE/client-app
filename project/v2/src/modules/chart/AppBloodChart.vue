<template>
  <canvas ref="canvas" />
</template>

<script>
import { INIT_BLOOD_DATASETS, INIT_BLOOD_OPTIONS } from '@/modules/chart/blood';
export default {
  props: ['labels', 'datas'],
  mounted() {
    this.chart = new Chart(this.$refs.canvas, {
      type: 'line',
      data: {
        datasets: INIT_BLOOD_DATASETS(this.datas),
        labels: this.labels,
      },
      options: INIT_BLOOD_OPTIONS(),
    });
  },
  watch: {
    datas(newVal) {
      this.chart.data.datasets = INIT_BLOOD_DATASETS(this.datas);
      this.chart.data.labels = this.labels;
      this.chart.update();
    },
  },
  beforeDestroy() {
    this.chart.destroy();
  },
};
</script>
