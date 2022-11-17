<template>
  <div class="content-wrap">
    <validation-observer ref="obs" v-slot="{ invalid }">
      <form @submit.prevent="submit">
        <div class="content">
          <div class="blue-top-box">
            <v-step-progress :percent="state.percent" :ing="state.ing" :total="state.total" />
          </div>
          <div class="cont-inner mb-space30">
            <div class="form-box">
              <v-history-taking-item
                v-for="(question, index) in ConfirmedQuestion"
                :key="question.order"
                :question="question"
                :index="(state.ing - 1) * 10 + index + 1"
                v-model="state.confirmedForm[index].value"
              />
            </div>
          </div>
        </div>
        <div class="btn-wrap">
          <button type="button" class="btn-line navy" v-show="showBeforeButton" @click="bofore">이전</button>
          <button type="button" class="btn-txt navy" v-show="showNextButton" :disabled="invalid" @click="next">다음</button>
          <button type="button" :disabled="invalid" v-show="showSubmitButton" class="btn-txt navy" @click="submit">제출</button>
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
import _merge from 'lodash/merge';
import HistoryModules from '@/modules/history/components';
import Confirmeddaylist from '@/modules/history/json/confirmeddaylist.json';

const INIT_FORM = () => {
  const list = [];
  Confirmeddaylist.forEach((element) => {
    if (element.answerType === 'CheckboxFactory') {
      list.push(_merge(element, { value: [] }));
    } else list.push(_merge(element, { value: '' }));
  });
  return list;
};

const INIT_STATE = () => ({
  ing: 1,
  total: parseInt(Confirmeddaylist.length / 10) + 1,
  percent: 0,
  confirmedForm: INIT_FORM(),
});

export default {
  data() {
    return {
      state: INIT_STATE(),
      test22: '',
    };
  },
  components: { ...HistoryModules },
  computed: {
    ConfirmedQuestion() {
      const start = (this.state.ing - 1) * 10;
      let end = this.state.ing * 10;
      if (end > Confirmeddaylist.length) {
        end = Confirmeddaylist.length;
      }
      return Confirmeddaylist.slice(start, end);
    },
    showBeforeButton() {
      return this.state.ing !== 1;
    },
    showNextButton() {
      return this.state.ing !== this.state.total;
    },
    showSubmitButton() {
      return this.state.total === this.state.ing;
    },
  },
  methods: {
    // 메서드 구현
    onSubmit: function () {
      console.log('submitted!');
    },
    //
    next() {
      this.state.ing++;
    },
    bofore() {
      this.state.ing--;
    },
    submit: function () {
      console.log('submit form');
    },
  },
  created() {
    console.log(this.state);
  },
};
</script>

<style></style>
