<template>
  <div class="content-wrap">
    <div class="content">
      <date-box :value="date" @change="onChangeDate" />
      <div class="cont-inner mb-space20 tb-space20">
        <div class="chart-data-wrap" v-if="detail.sleepTimeList.length > 0">
          <div class="chart-box">
            <div class="chart-mark">
              <span class="chart-mark-bg red">깨어남</span>
              <span class="chart-mark-bg yellow">렘 수면</span>
              <span class="chart-mark-bg skyblue">얕은 수면</span>
              <span class="chart-mark-bg blue">깊은 수면</span>
            </div>
            <div class="chart-inner">
              <app-sleep-chart :datas="datas" />
            </div>
            <div class="chart-label">
              <span v-for="(item, index) in labels" :key="`timelabel-${index}`">{{ item }}</span>
            </div>
          </div>

          <div>
            <h3 class="ttl-b">단계별 수면 시간</h3>
            <div class="line-box mt10">
              <ul class="sleep-info-box">
                <li class="total">
                  <span class="ttl">총 수면</span>
                  <div class="sleep-bar-wrap">
                    <div class="sleep-bar">
                      <div class="bar" style="width: 100%"></div>
                      <div class="txt" style="left: 100%">{{ totals.sleep.label }}</div>
                    </div>
                  </div>
                </li>
                <li class="wake">
                  <span class="ttl">깨어남</span>
                  <div class="sleep-bar-wrap">
                    <div class="sleep-bar">
                      <div class="bar" :style="`width: ${totals.wake.percent}%`"></div>
                      <div class="txt" :style="`left: ${totals.wake.percent}%`">{{ totals.wake.label }}</div>
                    </div>
                  </div>
                </li>
                <li class="rem">
                  <span class="ttl">렘 수면</span>
                  <div class="sleep-bar-wrap">
                    <div class="sleep-bar">
                      <div class="bar" :style="`width: ${totals.rem.percent}%`"></div>
                      <div class="txt" :style="`left: ${totals.rem.percent}%`">{{ totals.rem.label }}</div>
                    </div>
                  </div>
                </li>
                <li class="sleep">
                  <span class="ttl">얕은 수면</span>
                  <div class="sleep-bar-wrap">
                    <div class="sleep-bar">
                      <div class="bar" :style="`width: ${totals.shallow.percent}%`"></div>
                      <div class="txt" :style="`left: ${totals.shallow.percent}%`">{{ totals.shallow.label }}</div>
                    </div>
                  </div>
                </li>
                <li class="deep-sleep">
                  <span class="ttl">깊은 수면</span>
                  <div class="sleep-bar-wrap">
                    <div class="sleep-bar">
                      <div class="bar" :style="`width: ${totals.deep.percent}%`"></div>
                      <div class="txt" :style="`left: ${totals.deep.percent}%`">{{ totals.deep.label }}</div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
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
    "title": "수면"
  }
}
</route>
<script>
import { mapActions, mapGetters } from 'vuex';
import _head from 'lodash/head';
import _last from 'lodash/last';

import DateBox from '@/common/components/DateBox.vue';
import AppSleepChart from '@/modules/chart/AppSleepChart.vue';

import { SLEEP_DETAIL } from '@/modules/health';
import { INIT_DEEP_DATA, INIT_SHALLOW_DATA, INIT_WAKE_DATA } from '@/modules/chart/sleep';

export default {
  components: {
    DateBox,
    AppSleepChart,
  },
  data() {
    return {
      date: this.$dayjs('20221125').format('YYYYMMDD'),
    };
  },
  created() {
    this.fetchDetail({ date: this.date });
  },
  computed: {
    ...mapGetters({ detail: SLEEP_DETAIL }),
    datas() {
      return this.detail.sleepTimeList.map((item) => {
        if (item.sleepType === '2') return INIT_WAKE_DATA(item.sleepMin);
        else if (item.sleepType === '1') return INIT_SHALLOW_DATA(item.sleepMin);
        else if (item.sleepType === '0') return INIT_DEEP_DATA(item.sleepMin);
      });
    },
    totals() {
      let sleep = 0;

      let wake = 0;
      let rem = 0;
      let shallow = 0;
      let deep = 0;

      this.detail.sleepTimeList.forEach(({ sleepMin, sleepType }) => {
        sleep += sleepMin;
        if (sleepType === '3') rem += sleepMin;
        else if (sleepType === '2') wake += sleepMin;
        else if (sleepType === '1') shallow += sleepMin;
        else if (sleepType === '0') deep += sleepMin;
      });

      const getLabel = (min) => {
        const hour = Math.floor(min / 60);
        const _min = min % 60;
        let label = '';
        if (hour > 0) label += `${hour}시간`;
        if (_min > 0) label += ` ${_min}분`;
        return label.trim();
      };

      const getPercent = (value, total) => (100 * value) / total;

      return {
        sleep: {
          label: getLabel(sleep),
          percent: 100,
        },
        wake: {
          label: getLabel(wake),
          percent: getPercent(wake, sleep),
        },
        rem: {
          label: getLabel(rem),
          percent: getPercent(rem, sleep),
        },
        shallow: {
          label: getLabel(shallow),
          percent: getPercent(shallow, sleep),
        },
        deep: {
          label: getLabel(deep),
          percent: getPercent(deep, sleep),
        },
      };
    },
    labels() {
      const first = _head(this.detail.sleepTimeList);
      const last = _last(this.detail.sleepTimeList);
      const startTime = first.start.toDate().getTime();
      const endTime = last.end.toDate().getTime();
      const pivot = Math.round((endTime - startTime) / 4);
      return [
        first.start.format('HH:mm'),
        this.$dayjs(new Date(startTime + pivot)).format('HH:mm'),
        this.$dayjs(new Date(endTime - pivot)).format('HH:mm'),
        last.end.format('HH:mm'),
      ];
    },
  },
  methods: {
    ...mapActions({ fetchDetail: SLEEP_DETAIL }),
    onChangeDate(newDate) {
      this.date = newDate;
      this.fetchDetail({ date: this.date });
    },
  },
};
</script>

<style></style>
