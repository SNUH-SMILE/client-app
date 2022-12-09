<template>
  <section class="section-box">
    <div class="section-ttl-box">
      <h2 class="section-ttl">운동하기</h2>
      <button type="button" class="btn-ic-txt arrow" @click="moveExercise">바로가기</button>
    </div>
    <!-- nodata -->
    <div class="nodata-box" v-if="!exerciseShow">
      <p class="ic-txt exercise">예정된 운동이 없습니다.</p>
    </div>
    <!-- yesdata -->
    <div class="info-center-box" v-if="exerciseShow">
      <p class="txt-info"><strong class="ic-txt exercise">13:30</strong>에 운동이 예정되어 있습니다.</p>
      <strong class="sub-txt">&ldquo; 혈압에 좋은 오후 운동 &rdquo;</strong>
    </div>
  </section>
</template>

<script>
import { ENUM_BODY_STATUS } from '@/common/constants';
import { mapGetters } from 'vuex';
import { EXERCISE_BODY_STATUS } from '../exercise';
export default {
  data() {
    return {
      exerciseShow: true,
    };
  },
  computed: {
    ...mapGetters({ bodyStatus: EXERCISE_BODY_STATUS }),
  },
  methods: {
    moveExercise() {
      let name;
      switch (this.bodyStatus) {
        case ENUM_BODY_STATUS.STAGE1:
        case ENUM_BODY_STATUS.STAGE2:
          name = 'exercise';
          break;
        case ENUM_BODY_STATUS.BAD:
          name = 'exercist-none';
          break;
        default:
          name = 'exercise-before';
          break;
      }
      this.$router.push({ name });
    },
  },
};
</script>

<style></style>
