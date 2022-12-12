<template>
  <div class="content-wrap">
    <validation-observer ref="obs" v-slot="{ invalid }">
      <form @submit.prevent="submit">
        <div class="content" ref="content">
          <div class="blue-top-box">
            <v-step-progress :percent="percent" :ing="state.ing" :total="state.total" />
            <!-- TODO : 변화 적용 안됨 -->
          </div>
          <div class="cont-inner mb-space30">
            <div class="form-box">
              <v-history-taking-item
                v-for="(question, index) in ConfirmedQuestion"
                :key="question.order"
                :question="question"
                :index="(state.ing - 1) * 10 + index + 1"
                v-model="state.confirmedForm[(state.ing - 1) * 10 + index].value"
              />
            </div>
          </div>
        </div>
        <div class="btn-wrap">
          <button type="button" class="btn-line navy" v-if="state.ing !== 1" @click="before">이전</button>
          <button type="button" class="btn-txt navy" v-if="state.ing !== state.total" :disabled="invalid" @click="next">다음</button>
          <button type="button" :disabled="invalid" v-if="state.total === state.ing" class="btn-txt navy" @click="submit">제출</button>
        </div>
      </form>
    </validation-observer>
  </div>
</template>
<route>
{
  "meta" : {
    "title" : "확진 당일 문진"
  }
}
</route>
<script>
import { mapActions } from 'vuex';
import HistoryModules from '@/modules/history/components';
import Confirmeddaylist from '@/modules/history/json/confirmeddaylist.json';
import { initForm, submitForm, TYPE_CONFIRMED_DAY, SET_INTERVIEW_LIST } from '@/modules/history';
import { RESPONSE_STATUS } from '@/common/constants';
import _cloneDeep from 'lodash/cloneDeep';
const INIT_STATE = () => ({
  ing: 1,
  total: parseInt(Confirmeddaylist.length / 10) + 1,
  percent: 0,
  confirmedForm: initForm(_cloneDeep(Confirmeddaylist)),
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
    ConfirmedQuestion() {
      const start = (this.state.ing - 1) * 10;
      let end = this.state.ing * 10;
      if (end > Confirmeddaylist.length) {
        end = Confirmeddaylist.length;
      }
      return Confirmeddaylist.slice(start, end);
    },
  },
  methods: {
    // 메서드 구현
    ...mapActions({ setInterview: SET_INTERVIEW_LIST }),
    async submit() {
      const formData = submitForm(this.state.confirmedForm);
      const submitData = {
        interviewType: TYPE_CONFIRMED_DAY,
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
      const nowQuestion = this.state.confirmedForm.find((element) => {
        return element.order === nowOrder;
      });
      const childQuestion = this.state.confirmedForm.filter((element) => {
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
    next() {
      this.state.ing++;
      this.toTop();
    },
    before() {
      this.state.ing--;
      this.toTop();
    },
    toTop() {
      this.$refs.content.scrollIntoView();
    },
  },
  created() {
    this.$eventBus.$on('changeRequired', this.changeRequired);
  },
  beforeDestroy() {
    this.$eventBus.$off('changeRequired');
  },
};
</script>

<style></style>
