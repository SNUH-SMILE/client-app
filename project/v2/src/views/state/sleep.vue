<template>
  <div class="content-wrap">
    <div class="content">
      <date-box date="22.07.05" />
      <div class="cont-inner mb-space20 tb-space20">
        <div class="chart-data-wrap" v-if="chartShow">
          <div class="chart-box">
            <div class="chart-mark">
              <span class="chart-mark-bg red">깨어남</span>
              <span class="chart-mark-bg yellow">렘 수면</span>
              <span class="chart-mark-bg skyblue">얕은 수면</span>
              <span class="chart-mark-bg blue">깊은 수면</span>
            </div>
            <div class="chart-inner">
              <canvas id="sleepChart"></canvas>
            </div>
            <div class="chart-label">
              <span>21:00</span>
              <span>00:00</span>
              <span>03:00</span>
              <span>06:00</span>
            </div>
          </div>

          <div>
            <h3 class="ttl-b">단계별 수면 시간</h3>
            <div class="line-box mt10">
              <ul class="sleep-info-box">
                <li v-for="item in sleepData" :key="item.index" :class="item.class">
                  <span class="ttl">{{ item.title }}</span>
                  <div class="sleep-bar-wrap">
                    <div class="sleep-bar">
                      <div class="bar" :style="{ width: item.value + '%' }"></div>
                      <div class="txt" :style="{ left: item.value + '%' }">{{ item.time }}</div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
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
    "title": "수면"
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
      sleepData: [
        {
          class: 'total',
          title: '총 수면',
          time: '6시간 30분',
          value: 100,
        },
        {
          class: 'wake',
          title: '깨어남',
          time: '30분',
          value: 10,
        },
        {
          class: 'rem',
          title: '렘 수면',
          time: '1시간 10분',
          value: 20,
        },
        {
          class: 'sleep',
          title: '얕은 수면',
          time: '3시간',
          value: 45,
        },
        {
          class: 'deep-sleep',
          title: '깊은 수면',
          time: '1시간 50분',
          value: 25,
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
