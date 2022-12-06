<template>
  <canvas ref="canvas" />
</template>

<script>
import { INIT_LINE_DATA, INIT_LINE_OPTIONS } from '@/modules/chart/line';
export default {
  props: ['labels', 'datas'],
  mounted() {
    const datasets = [
      {
        data: this.datas,
        ...INIT_LINE_DATA(),
      },
    ];
    this.chart = new Chart(this.$refs.canvas, {
      type: 'line',
      data: {
        datasets,
        labels: this.labels,
      },
      options: INIT_LINE_OPTIONS(),
    });
  },
  watch: {
    datas(newVal) {
      this.chart.data.datasets = [
        {
          data: this.datas,
          ...INIT_LINE_DATA(),
        },
      ];
      this.chart.data.labels = this.labels;
      this.chart.update();
    },
  },
  beforeDestroy() {
    this.chart.destroy();
  },
};
</script>
