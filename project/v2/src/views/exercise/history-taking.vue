<template>
  <div class="content-wrap">
    <app-exercise-history-taking />
  </div>
</template>
<route>
{
  "meta" : {
    "title" : "몸 상태 체크하기"
  }
}
</route>
<script>
import AppExerciseHistoryTaking from '@/modules/history/components/AppExerciseHistoryTaking.vue';
export default {
  components: { AppExerciseHistoryTaking },
};
</script>

<style></style>
