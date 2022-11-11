<template>
  <div class="content-wrap">
    <div class="content">
      <date-box :value="date" @change="handleValue" />
      <div class="cont-inner mb-space20 tb-space20">
        <div class="chart-data-wrap" v-if="chartShow">
          <div class="chart-box">
            <div class="chart-mark">
              <span class="chart-mark-dcircle">수축기 혈압</span>
              <span class="chart-mark-circle">이완기 혈압</span>
            </div>
            <div class="chart-inner">
              <!-- <BarChart /> -->
              <blood-chart :originData="tableData" />
              <!-- <canvas id="bloodChart"></canvas>
              <span class="unit">mmHg</span> -->
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
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">측정일시</th>
                  <th scope="col">수축기 혈압 (mmHg)</th>
                  <th scope="col">이완기 혈압 (mmHg)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in tableData" :key="item.index">
                  <td>{{ item.time.substring(0, 2) }}:{{ item.time.substring(2, 4) }}</td>
                  <td>{{ item.sbp }}</td>
                  <td>{{ item.dbp }}</td>
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
    "title": "혈압"
  }
}
</route>
<script>
import { detailBodyData } from '@/services/native/health.js';
import DateBox from '@/common/components/DateBox.vue';
import BloodChart from '@/components/BloodChart.vue';
const DETAIL_BLOOD_PRESSURE_CB_NM = '__detailBloodPresure';
const getTableData = (item) => {
  return {
    time: item.resultTime,
    sbp: item.sbp,
    dbp: item.dbp,
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
    BloodChart,
  },
  computed: {
    chartShow() {
      if (this.tableData.length > 0) {
        return true;
      } else return false;
    },
  },
  methods: {
    getBloodData() {
      detailBodyData(this.date, 'BLOOD', DETAIL_BLOOD_PRESSURE_CB_NM);
    },
    handleValue(value) {
      this.date = value;
      this.getBloodData();
    },
  },
  created() {
    window[DETAIL_BLOOD_PRESSURE_CB_NM] = (args) => {
      this.tableData.splice(0);
      args.bpList.forEach((item) => {
        this.tableData.push(getTableData(item));
      });
      console.log(args);
    };
    this.getBloodData();
  },
};
</script>

<style></style>
