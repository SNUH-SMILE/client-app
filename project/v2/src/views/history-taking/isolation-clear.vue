<template>
  <div class="content-wrap">
    <validation-observer tag="form" v-slot="{ invalid }">
      <form @submit.prevent="submit">
        <div class="content">
          <div class="blue-top-box">
            <v-step-progress :percent="percent" :ing="state.ing" :total="state.total" />
          </div>
          <div class="cont-inner mb-space30">
            <div class="form-box">
              <v-history-taking-item
                v-for="(question, index) in isolationQuestion"
                :key="question.order"
                :question="question"
                :index="(state.ing - 1) * 10 + index + 1"
                v-model="state.isolationForm[(state.ing - 1) * 10 + index].value"
              ></v-history-taking-item>
            </div>
          </div>
        </div>
        <div class="btn-wrap">
          <button type="button" class="btn-line navy" v-show="state.ing !== 1" @click="state.ing--">이전</button>
          <button type="button" class="btn-txt navy" v-show="state.ing !== state.total" :disabled="invalid" @click="state.ing++">다음</button>
          <button type="button" :disabled="invalid" v-show="state.total === state.ing" class="btn-txt navy" @click="submit">제출</button>
        </div>
      </form>
    </validation-observer>
  </div>
</template>
<route>
{
  "meta" : {
    "title" : "격리 해제 시 문진"
  }
}
</route>
<script>
import { mapActions } from 'vuex';
import HistoryModules from '@/modules/history/components';
import isolationClearList from '@/modules/history/json/isolation-clear.json';
import { initForm, submitForm, TYPE_ISOLATION_DAY, SET_INTERVIEW_LIST } from '@/modules/history';
import { RESPONSE_STATUS } from '@/common/constants';

const INIT_STATE = () => ({
  ing: 1,
  total: parseInt(isolationClearList.length / 10),
  isolationForm: initForm(isolationClearList),
});

export default {
  data() {
    return {
      state: INIT_STATE(),
    };
  },
  components: { ...HistoryModules },
  computed: {
    percent() {
      return parseInt((this.state.ing / this.state.total) * 100);
    },
    isolationQuestion() {
      const start = (this.state.ing - 1) * 10;
      let end = this.state.ing * 10;
      if (end > isolationClearList.length) {
        end = isolationClearList.length;
      }
      return isolationClearList.slice(start, end);
    },
  },
  methods: {
    ...mapActions({ setInterview: SET_INTERVIEW_LIST }),
    async submit() {
      const formData = submitForm(this.state.isolationForm);
      const submitData = {
        interviewType: TYPE_ISOLATION_DAY,
        interviewDate: this.getInterviewDate(),
        answerList: formData,
      };
      const { code, message, data } = await this.setInterview(submitData);
      if (code === RESPONSE_STATUS.SUCCESS) {
        this.$toast('제출되었습니다.');
        this.$router.replace({ name: 'history-taking' });
      }
    },
    getInterviewDate() {
      const date = this.$dayjs().format('YYYYMMDDhhmm');
      return date;
    },
    changeRequired(nowOrder) {
      const nowQuestion = this.state.isolationForm.find((element) => {
        return element.order === nowOrder;
      });
      const childQuestion = this.state.isolationForm.filter((element) => {
        return nowQuestion.child.includes(element.order);
      });
      childQuestion.forEach((child) => {
        if (typeof nowQuestion.value === 'object') {
          nowQuestion.value.forEach((element) => {
            if (child.requiredValues.includes(element + '')) {
              child.answerRequired = 'required';
            } else {
              child.answerRequired = '';
              child.value = '';
            }
          });
        } else {
          if (child.requiredValues.includes(nowQuestion.value)) {
            child.answerRequired = 'required';
          } else {
            child.answerRequired = '';
            child.value = '';
          }
        }
      });
    },
  },
  created() {
    this.$eventBus.$on('changeRequired', this.changeRequired);
  },
};
</script>

<style></style>
