<template>
  <div class="content-wrap">
    <div class="content">
      <date-box date="22.07.05" />
      <div class="cont-inner mb-space20 tb-space20">
        <div class="chart-data-wrap" v-if="chartShow">
          <div class="chart-box">
            <div class="chart-mark">
              <span class="chart-mark-dcircle">수축기 혈압</span>
              <span class="chart-mark-circle">이완기 혈압</span>
            </div>
            <div class="chart-inner">
              <canvas id="bloodChart"></canvas>
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
                <tr v-for="item in tableData" :key="item.index">
                  <td>{{ item.time }}</td>
                  <td>{{ item.valueShrink }}</td>
                  <td>{{ item.valueRelax }}</td>
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
import DateBox from '@/common/components/DateBox.vue';

const INIT_STATE = () => ({});

export default {
  data() {
    return {
      state: INIT_STATE(),
      tableData: [
        {
          time: '09:00',
          valueShrink: 70,
          valueRelax: 100,
        },
        {
          time: '10:00',
          valueShrink: 75,
          valueRelax: 112,
        },
      ],
      chartShow: false,
    };
  },
  components: {
    DateBox,
  },
};
</script>

<style></style>
