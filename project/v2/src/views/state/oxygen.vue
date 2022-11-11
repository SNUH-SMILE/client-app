<template>
  <div class="content-wrap">
    <div class="content">
      <date-box :value="date" @change="handleValue" />
      <div class="cont-inner mb-space20 tb-space20">
        <div class="chart-data-wrap" v-if="chartShow">
          <div class="chart-box">
            <div class="chart-mark">
              <span class="chart-mark-circle">산소포화도</span>
            </div>
            <div class="chart-inner">
              <line-chart :originData="tableData" :options="options" />
              <!-- <span class="unit ml10">%</span> -->
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
                  <th scope="col">산소포화도(%)</th>
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
    "title": "산소포화도"
  }
}
</route>

<script>
import { detailBodyData } from '@/services/native/health.js';
import DateBox from '@/common/components/DateBox.vue';
import LineChart from '@/components/LineChart.vue';

const DETIAL_OXYGEN_CB_NM = '__detailOxygen';
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
    getOxygenValue() {
      detailBodyData(this.date, 'OXYGEN', DETIAL_OXYGEN_CB_NM);
    },
    handleValue(value) {
      this.date = value;
      this.getOxygenValue();
    },
  },
  created() {
    window[DETIAL_OXYGEN_CB_NM] = (args) => {
      this.tableData.splice(0);
      args.spO2List.forEach((item) => {
        this.tableData.push(getTableData(item));
      });
      console.log(args);
    };
    this.getOxygenValue();
  },
};
</script>

<style></style>
