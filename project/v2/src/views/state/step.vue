<template>
  <div class="content-wrap">
    <div class="content">
      <date-box date="22.07.05" />
      <div class="cont-inner mb-space20 tb-space20">
        <div class="chart-data-wrap" v-if="chartShow">
          <div class="chart-box">
            <div class="chart-mark">
              <span class="chart-mark-circle">걸음수</span>
            </div>
            <div class="chart-inner">
              <canvas id="stepChart"></canvas>
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
                  <td>{{ item.time }}</td>
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
import DateBox from '@/common/components/DateBox.vue';

const INIT_STATE = () => ({});

export default {
  data() {
    return {
      state: INIT_STATE(),
      tableData: [
        {
          time: '09:00',
          value: 70,
        },
        {
          time: '10:00',
          value: 75,
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
