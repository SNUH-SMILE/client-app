<template>
  <div class="content-wrap">
    <validation-observer ref="obs" v-slot="{ invalid }">
      <form @submit.prevent="onSubmit">
        <div class="content">
          <div class="cont-inner mb-space30">
            <div class="form-box">
              <app-history-taking-item
                v-for="(question, index) in exerciseList"
                :key="question.order"
                :question="question"
                :index="index + 1"
                v-model="state.exerciseForm[index].value"
              />
            </div>
          </div>
        </div>
        <div class="btn-wrap">
          <button type="button" :disabled="invalid" class="btn-txt navy" @click="onSubmit">제출</button>
        </div>
      </form>
    </validation-observer>
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
import { initForm } from '@/modules/history';
import { AppHistoryTakingItem } from '@/modules/history/components';
import exerciseList from '@/modules/history/json/exerciselist.json';
const INIT_STATE = () => ({
  exerciseForm: initForm(exerciseList),
});
const NONE_TARGET = '비대상자';
const STEP_ONE = 'STEP1';
const STEP_TWO = 'STEP2';

const getPathName = {
  [NONE_TARGET]: 'exercise-none',
  [STEP_ONE]: 'exercise',
  [STEP_TWO]: 'exercise',
};
export default {
  data() {
    return {
      state: INIT_STATE(),
    };
  },
  components: { AppHistoryTakingItem },
  computed: {
    exerciseList() {
      return exerciseList;
    },
  },
  methods: {
    // 메서드 구현
    onSubmit() {
      const status = this.getStatus();
      const path = getPathName[status];
      this.$router.replace({ name: path });
    },
    getStatus() {
      for (let i = 0; i < 8; i++) {
        // 1 ~ 8 중에 예를 고를 경우 > 비대상자
        if (this.state.exerciseForm[i].value === '예') return NONE_TARGET;
      }
      if (this.state.exerciseForm[8].value === '격리 중') return STEP_ONE; // 격리중이면 > STEP 1
      return STEP_TWO; // 격리 중이지 않을 경우 > STEP2
    },
  },
};
</script>

<style></style>
