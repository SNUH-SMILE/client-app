<template>
  <section class="section-box">
    <div class="section-ttl-box">
      <h2 class="section-ttl">운동하기</h2>
      <button type="button" class="btn-ic-txt arrow" @click="moveExercise">바로가기</button>
    </div>
    <!-- yesdata -->
    <div class="info-center-box" v-if="alarmDetail">
      <p class="txt-info">
        <strong class="ic-txt exercise">{{ alarmDetail.timeLabel }}</strong
        >에 운동이 예정되어 있습니다.
      </p>
      <strong class="sub-txt">&ldquo; {{ alarmDetail.body }} &rdquo;</strong>
    </div>
    <!-- nodata -->
    <div class="nodata-box" v-else>
      <p class="ic-txt exercise">예정된 운동이 없습니다.</p>
    </div>
  </section>
</template>

<script>
import { ENUM_BODY_STATUS, ENUM_DATE_FORMAT } from '@/common/constants';
import { mapActions, mapGetters } from 'vuex';
import { EXERCISE_ALARMS, EXERCISE_BODY_STATUS, LAST_INTERVIEW_DATE } from '../exercise';
export default {
  async activated() {
    await this.fetchAlarms();
  },
  computed: {
    ...mapGetters({ bodyStatus: EXERCISE_BODY_STATUS, alarms: EXERCISE_ALARMS, lastInterviewDate: LAST_INTERVIEW_DATE }),
    alarmDetail() {
      if (this.alarms.length > 0) {
        return this.alarms[0];
      } else {
        return null;
      }
    },
  },
  methods: {
    ...mapActions({ fetchAlarms: EXERCISE_ALARMS }),
    moveExercise() {
      if (this.lastInterviewDate !== this.$dayjs().format(ENUM_DATE_FORMAT.YMD)) {
        return this.$alert('금일 문진을 먼저 진행해주시길 바랍니다.');
      }
      let name;

      switch (this.bodyStatus) {
        case ENUM_BODY_STATUS.STAGE1:
        case ENUM_BODY_STATUS.STAGE2:
          name = 'exercise';
          break;
        case ENUM_BODY_STATUS.BAD:
        default:
          name = 'exercise-none';
      }
      this.$router.push({ name });
    },
  },
};
</script>

<style></style>
