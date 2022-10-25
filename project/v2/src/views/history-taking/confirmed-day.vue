<template>
  <div class="content-wrap">
    <validation-observer v-slot="{ validate }">
      <form @submit.prevent="validate().then(submit)">
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
                :index="index + 1"
                v-model="state.confirmedForm[index].value"
              ></v-history-taking-item>
            </div>
          </div>
        </div>
        <div class="btn-wrap">
          <button type="button" class="btn-line navy" @click="$router.go(-1)">이전</button>
          <!-- TODO : user-check 어디로 갈 지 수정해야함. -->

          <button type="submit" class="btn-txt navy" @click="test">제출</button>
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
    };
  },
  components: { ...HistoryModules },
  computed: {
    ConfirmedQuestion() {
      return Confirmeddaylist;
    },
  },
  methods: {
    // 메서드 구현
    onSubmit: function () {
      console.log('submitted!');
    },
    //
    test: function () {
      console.log(this.state.confirmedForm);
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
