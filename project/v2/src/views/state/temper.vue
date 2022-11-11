<template>
  <div class="content-wrap">
    <div class="content">
      <date-box :value="date" @change="handleValue" />
      <div class="cont-inner mb-space20 tb-space20">
        <div class="chart-data-wrap" v-if="chartShow">
          <div class="chart-box">
            <div class="chart-mark">
              <span class="chart-mark-circle">체온</span>
              <span class="chart-mark-dashed">정상범위</span>
            </div>
            <div class="chart-inner">
              <line-chart :originData="tableData" :options="options" />
              <!-- <span class="unit ml10">℃</span> -->
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
                  <th scope="col">체온(℃)</th>
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
    "title": "체온"
  }
}
</route>

<script>
import { detailBodyData } from '@/services/native/health.js';
import DateBox from '@/common/components/DateBox.vue';
import LineChart from '@/components/LineChart.vue';

const DETAIL_BLOOD_TEMPER_CB_NM = '__detailBloodTemper';
const getTableData = (item) => {
  return {
    time: item.resultTime,
    value: item.bt,
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
                // min: 50,
                stepSize: 1,
                suggestedMin: 35,
                suggestedMax: 40,
                beginAtZero: false,
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
    getBloodTemperate() {
      detailBodyData(this.date, 'TEMP', DETAIL_BLOOD_TEMPER_CB_NM);
    },
    handleValue(value) {
      this.date = value;
      this.getBloodTemperate();
    },
  },
  created() {
    window[DETAIL_BLOOD_TEMPER_CB_NM] = (args) => {
      this.tableData.splice(0);
      args.btList.forEach((item) => {
        this.tableData.push(getTableData(item));
      });
      console.log(args);
    };
    this.getBloodTemperate();
  },
};
</script>

<style></style>
