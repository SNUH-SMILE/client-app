<template>
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
</template>
<script>
import { mapMutations } from 'vuex';
import { initForm } from '@/modules/history';
import { AppHistoryTakingItem } from '@/modules/history/components';
import exerciseList from '@/modules/history/json/exerciselist.json';
import { EXERCISE_BODY_STATUS } from '@/modules/exercise';
import { ENUM_BODY_STATUS } from '@/common/constants';
const INIT_STATE = () => ({
  exerciseForm: initForm(exerciseList),
});

export default {
  data() {
    return {
      state: INIT_STATE(),
      exerciseList,
    };
  },
  components: { AppHistoryTakingItem },
  methods: {
    ...mapMutations({ setBodyStatus: EXERCISE_BODY_STATUS }),
    // 메서드 구현
    onSubmit() {
      const name = this.getStatus();
      this.$router.replace({ name });
    },
    getStatus() {
      for (let i = 0; i < 8; i++) {
        // 1 ~ 8 중에 예를 고를 경우 > 비대상자
        if (this.state.exerciseForm[i].value === '1') {
          this.setBodyStatus(ENUM_BODY_STATUS.BAD);
          return 'exercise-none';
        }
      }

      if (this.state.exerciseForm[8].value == 0) {
        this.setBodyStatus(ENUM_BODY_STATUS.STAGE1);
      } else {
        this.setBodyStatus(ENUM_BODY_STATUS.STAGE2);
      }
      return 'exercise'; // 격리중이면 > STEP 1
    },
  },
};
</script>

<style></style>
