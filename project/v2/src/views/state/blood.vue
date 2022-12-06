<template>
  <div class="content-wrap">
    <div class="content">
      <date-box :value="date" @change="onChangeDate" />
      <div class="cont-inner mb-space20 tb-space20">
        <div class="chart-data-wrap" v-if="detail.length > 0">
          <div class="chart-box">
            <div class="chart-mark">
              <span class="chart-mark-dcircle">수축기 혈압</span>
              <span class="chart-mark-circle">이완기 혈압</span>
            </div>
            <div class="chart-inner">
              <app-blood-chart :labels="labels" :datas="datas" />
              <span class="unit">mmHg</span>
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
                <tr v-for="item in detail" :key="item.index">
                  <td>{{ item.timeLabel }}</td>
                  <td>{{ item.sbp }}</td>
                  <td>{{ item.dbp }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- nodata -->
        <div class="nochart-box" v-else>
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
import { mapActions, mapGetters } from 'vuex';
import DateBox from '@/common/components/DateBox.vue';
import AppBloodChart from '@/modules/chart/AppBloodChart.vue';
import { BLOOD_DETAIL } from '@/modules/health';

export default {
  components: {
    DateBox,
    AppBloodChart,
  },
  data() {
    return {
      date: this.$dayjs().format('YYYYMMDD'),
    };
  },
  created() {
    this.fetchDetail({ date: this.date });
  },
  computed: {
    ...mapGetters({ detail: BLOOD_DETAIL }),
    labels() {
      return this.detail.map(({ timeLabel }) => timeLabel);
    },
    datas() {
      return this.detail.map(({ dbp, sbp }) => {
        return [Number(dbp), Number(sbp)];
      });
    },
  },
  methods: {
    ...mapActions({ fetchDetail: BLOOD_DETAIL }),
    onChangeDate(newDate) {
      this.date = newDate;
      this.fetchDetail({ date: this.date });
    },
  },
};
</script>

<style></style>
