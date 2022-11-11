<template>
  <div class="content-wrap">
    <div class="content">
      <date-box :value="date" @change="handleValue" />
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
              <bar-chart :originData="tableData" :totalTime="sleepData" />
            </div>
            <div class="chart-label">
              <span v-for="time in sleepLabel" :key="time.index">{{ time }}</span>
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
                      <div class="bar" :style="{ width: item.percentage + '%' }"></div>
                      <div class="txt" :style="{ left: item.percentage + '%' }">{{ getTimeStr(item.time) }}</div>
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
import { detailBodyData } from '@/services/native/health.js';
import DateBox from '@/common/components/DateBox.vue';
import BarChart from '@/components/BarChart.vue';
const DETAIL_SLEEP_CB_NM = '__detailSleep';
const getTableData = (item) => {
  return {
    sleepStartDate: item.sleepStartDate,
    sleepEndDate: item.sleepEndDate,
    sleepStartTime: item.sleepStartTime,
    sleepEndTime: item.sleepEndTime,
    sleepType: item.sleepType,
  };
};
export default {
  data() {
    return {
      date: this.$dayjs().format('YYYYMMDD'),
      tableData: [],
      // options: {
      //   maintainAspectRatio: false,
      //   layout: {
      //     padding: {
      //       top: 10,
      //       left: 20,
      //       // right: 20,
      //       bottom: 8,
      //     },
      //   },
      //   legend: {
      //     display: false,
      //   },
      //   tooltips: {
      //     enabled: false,
      //   },
      //   scales: {
      //     xAxes: [
      //       {
      //         offset: true,
      //         // display: true,
      //         stacked: true,
      //         gridLines: {
      //           padding: 3,
      //           drawOnChartArea: false,
      //           drawTicks: false,
      //           color: '#979797',
      //         },
      //         ticks: {
      //           autoSkip: false,
      //           min: 0,
      //           // max: ,
      //           stepSize: 1,
      //           // callback: function (label, index, labels) {
      //           //   var returnData = '';
      //           //   if (difArr.indexOf(label) > -1) {
      //           //     returnData = nextHourDt.add(1, 'hours').format('HH:mm');
      //           //     return returnData;
      //           //   } else {
      //           //     switch (label) {
      //           //       case 0:
      //           //         return moment(row.labels[0].sleepStartTime, 'YYYYMMDDHHmm').format('HH:mm');
      //           //       case row.labels[row.labels.length - 1].diffSum:
      //           //         return moment(row.labels[row.labels.length - 1].sleepEndTime, 'YYYYMMDDHHmm').format('HH:mm');
      //           //       default:
      //           //         return '';
      //           //     }
      //           //   }
      //           // },
      //         },
      //       },
      //     ],
      //     yAxes: [
      //       {
      //         // display: true,
      //         stacked: true,
      //         gridLines: {
      //           // 가로선
      //           drawOnChartArea: false,
      //           drawBorder: true,
      //           color: '#979797',
      //           drawTicks: false,
      //           // offset: false
      //         },
      //         ticks: {
      //           display: false,
      //           // crossAlign: bottom
      //         },
      //       },
      //     ],
      //   },
      // },
    };
  },
  components: {
    DateBox,
    BarChart,
  },
  methods: {
    getSleepData() {
      detailBodyData(this.date, 'SLEEP', DETAIL_SLEEP_CB_NM);
    },
    handleValue(value) {
      this.date = value;
      this.getSleepData();
    },
    getTimeStr(time) {
      const hour = parseInt(time / 60);
      const min = time % 60;
      let result = '';
      if (hour > 0) {
        result += hour + '시간 ';
      }
      if (min != 0) {
        result += min + '분';
      }
      return result;
    },
  },
  computed: {
    chartShow() {
      if (this.tableData.length > 0) {
        return true;
      } else return false;
    },
    sleepData() {
      const Time = {
        0: 0,
        1: 0,
        2: 0,
        3: 0, //TODO: 렘수면 코드 선택해야함. 렘 수면 일것으로 예상
        4: 0, // total
      };
      this.tableData.forEach((item) => {
        const startTime = this.$dayjs(item.sleepStartDate + ' ' + item.sleepStartTime);
        const endTime = this.$dayjs(item.sleepEndDate + ' ' + item.sleepEndTime);
        const duration = endTime.diff(startTime, 'minute'); // 1440
        Time[item.sleepType] += duration;
        Time[4] += duration;
      });
      return [
        {
          class: 'total',
          title: '총 수면',
          time: Time[4],
          percentage: 100,
        },
        {
          class: 'wake',
          title: '깨어남',
          time: Time[2],
          percentage: parseInt((Time[2] / Time[4]) * 100),
        },
        {
          class: 'rem',
          title: '렘 수면',
          time: Time[3],
          percentage: parseInt((Time[3] / Time[4]) * 100),
        },
        {
          class: 'sleep',
          title: '얕은 수면',
          time: Time[1],
          percentage: parseInt((Time[1] / Time[4]) * 100),
        },
        {
          class: 'deep-sleep',
          title: '깊은 수면',
          time: Time[0],
          percentage: parseInt((Time[0] / Time[4]) * 100),
        },
      ];
    },
    sleepLabel() {
      const startTime = this.$dayjs(this.tableData[0].sleepStartDate + ' ' + this.tableData[0].sleepStartTime);
      const endTime = this.$dayjs(
        this.tableData[this.tableData.length - 1].sleepEndDate + ' ' + this.tableData[this.tableData.length - 1].sleepEndTime
      );
      const quarter = endTime.diff(startTime, 'minute') / 4; // 1440
      const list = [];
      list.push(startTime.format('HH:mm'));
      const nextHourDt = startTime.add(quarter, 'minute');
      list.push(nextHourDt.format('HH:mm'));
      const nextHourDt2 = startTime.add(quarter, 'minute');
      list.push(nextHourDt2.format('HH:mm'));
      list.push(endTime.format('HH:mm'));
      return list;
    },
  },
  created() {
    window[DETAIL_SLEEP_CB_NM] = (args) => {
      this.tableData.splice(0);
      args.sleepTimeList.forEach((item) => {
        this.tableData.push(getTableData(item));
      });
      console.log(args);
    };
    this.getSleepData();
  },
};
</script>

<style></style>
