<template>
  <div class="content-wrap">
    <div class="content">
      <date-box :value="date" @change="onChangeDate" />
      <div class="cont-inner mb-space20 tb-space20">
        <div class="chart-data-wrap" v-if="detail.length > 0">
          <div class="chart-box">
            <div class="chart-mark">
              <span class="chart-mark-circle">심박수</span>
            </div>
            <div class="chart-inner">
              <app-line-chart :labels="labels" :datas="datas" />
              <span class="unit">회/분</span>
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
                  <th scope="col">심박수(회/분)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in detail" :key="item.index">
                  <td>{{ item.timeLabel }}</td>
                  <td>{{ item.hr }}</td>
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
    "title": "심박수"
  }
}
</route>
<script>
import { mapActions, mapGetters } from 'vuex';
import DateBox from '@/common/components/DateBox.vue';
import AppLineChart from '@/modules/chart/AppLineChart.vue';
import { HEART_DETAIL } from '@/modules/health';

export default {
  components: {
    DateBox,
    AppLineChart,
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
    ...mapGetters({ detail: HEART_DETAIL }),
    labels() {
      return this.detail.map(({ timeLabel }) => timeLabel);
    },
    datas() {
      return this.detail.map(({ hr }) => {
        return Number(hr);
      });
    },
  },
  methods: {
    ...mapActions({ fetchDetail: HEART_DETAIL }),
    onChangeDate(newDate) {
      this.date = newDate;
      this.fetchDetail({ date: this.date });
    },
  },
};
</script>

<style></style>
