<template>
  <div class="content-wrap">
    <div class="content">
      <div class="blue-top-box">
        <strong>나를 위한 맞춤 운동</strong>
      </div>
      <app-exercise-list />
    </div>
  </div>
</template>
<route>
{
    "meta" : {
        "title" : "운동하기"
    }
}
</route>
<script>
import AppExerciseList from '@/modules/exercise/AppExerciseList.vue';

export default {
  components: { AppExerciseList },
};
</script>

<style></style>
