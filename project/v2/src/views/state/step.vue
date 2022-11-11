<template>
  <div class="content-wrap">
    <div class="content">
      <date-box :value="date" @change="handleValue" />
      <div class="cont-inner mb-space20 tb-space20">
        <div class="chart-data-wrap" v-if="chartShow">
          <div class="chart-box">
            <div class="chart-mark">
              <span class="chart-mark-circle">걸음수</span>
            </div>
            <div class="chart-inner">
              <line-chart :originData="tableData" :options="options" />
              <span class="unit">걸음</span>
            </div>
          </div>

          <div class="tbl-wrap line-box">
            <table class="tbl tbl-info">
              <caption>
                측정 목록
              </caption>
              <colgroup>
                <col />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">측정일시</th>
                  <th scope="col">걸음수</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in tableData" :key="item.index">
                  <td>{{ item.time.substring(0, 2) }}:{{ item.time.substring(2, 4) }}</td>
                  <td>{{ item.value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- nodata -->
        <div class="nochart-box" v-if="!chartShow">
          <p>측정된 정보가 없습니다.</p>
        </div>
      </div>
    </div>
  </div>
</template>
<route>
{
  "meta": {
    "title": "걸음수"
  }
}
</route>
<script>
import { detailBodyData } from '@/services/native/health.js';
import DateBox from '@/common/components/DateBox.vue';
import LineChart from '@/components/LineChart.vue';
const DETAIL_STEP_COOUNT_CB_NM = '__detailStepCount';

const getTableData = (item) => {
  return {
    time: item.resultTime,
    value: item.stepCount,
  };
};
export default {
  data() {
    return {
      tableData: [],
      date: this.$dayjs().format('YYYYMMDD'),
      options: {
        scales: {
          yAxes: [
            {
              offset: true,
              gridLines: {
                borderDash: [2],
                color: '#ddd',
                drawTicks: false,
                offset: true,
              },
              ticks: {
                stepSize: 1,
                suggestedMin: 35,
                suggestedMax: 40,
                beginAtZero: true,
                padding: 3,
                fontColor: '#999',
                fontSize: 12,
              },
            },
          ],
          xAxes: [
            {
              offset: true,
              gridLines: {
                drawOnChartArea: false,
                drawTicks: false,
                color: '#ddd',
              },
              ticks: {
                fontColor: '#999',
                fontSize: 12,
                stepSize: 1,
                beginAtZero: true,
                padding: 8,
              },
            },
          ],
        },
      },
    };
  },
  components: {
    DateBox,
    LineChart,
  },
  computed: {
    chartShow() {
      if (this.tableData.length > 0) {
        return true;
      } else return false;
    },
  },
  methods: {
    getStepData() {
      detailBodyData(this.date, 'STEP', DETAIL_STEP_COOUNT_CB_NM);
    },
    handleValue(value) {
      this.date = value;
      console.log(value);
      this.getStepData();
    },
  },
  created() {
    window[DETAIL_STEP_COOUNT_CB_NM] = (args) => {
      this.tableData.splice(0);
      args.stepCountList.forEach((item) => {
        this.tableData.push(getTableData(item));
      });
    };
    this.getStepData();
  },
};
</script>

<style></style>
