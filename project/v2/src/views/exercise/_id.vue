<template>
  <app-exercise-detail :videoId="$route.params.id" />
</template>
<route>
{
  "meta": {
    "title": "운동 상세"
  }
}
</route>
<script>
import Vue from 'vue';
import AppExerciseDetail from '@/modules/exercise/AppExerciseDetail.vue';
export default {
  components: { AppExerciseDetail },
  beforeRouteEnter(to, from, next) {
    if (!to.params.id) {
      next(false);
      Vue.$alert('잘못된 접근입니다.');
    } else {
      next();
    }
  },
};
</script>

<style></style>
