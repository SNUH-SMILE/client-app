<template>
  <div class="content-wrap">
    <validation-observer tag="form" v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(onSubmit)">
        <div class="content">
          <div class="blue-top-box">
            <v-step-progress :percent="state.percent" :ing="state.ing" :total="state.total" />
          </div>
          <div class="cont-inner mb-space30">
            <div class="form-box">
              <v-history-taking-item
                v-for="(question, index) in amPmQuestion"
                :key="question.order"
                :question="question"
                :index="(state.ing - 1) * 10 + index + 1"
                v-model="state.confirmedForm[index].value"
              ></v-history-taking-item>
            </div>
          </div>
        </div>
        <div class="btn-wrap">
          <button type="button" class="btn-line navy" @click="$router.go(-1)">이전</button>
          <!-- TODO : user-check 어디로 갈 지 수정해야함. -->

          <button type="submit" class="btn-txt navy">제출</button>
        </div>
      </form>
    </validation-observer>
  </div>
</template>
<route>
{
  "meta" : {
    "title" : "오전/오후 문진"
  }
}
</route>
<script>
import HistoryModules from '@/modules/history/components';
import amList from '@/modules/history/json/amlist.json';
import initForm from '@/modules/history';
const INIT_STATE = () => ({
  ing: 1,
  total: parseInt(amList.length / 10) + 1,
  percent: 0,
});

export default {
  data() {
    return {
      state: INIT_STATE(),
    };
  },
  components: { ...HistoryModules },
  computed: {
    amPmQuestion() {
      return amList;
    },
  },
  methods: {
    // 메서드 구현
    onSubmit: function () {
      console.log('submitted!');
    },
  },
};
</script>

<style></style>
