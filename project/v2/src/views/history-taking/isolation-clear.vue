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
                v-for="(question, index) in isolationClearQuestion"
                :key="question.order"
                :question="question"
                :index="index + 1"
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
    "title" : "격리 해제 시 문진"
  }
}
</route>
<script>
import HistoryModules from '@/modules/history/components';
import isolationClearlist from '@/modules/history/json/isolation-clear.json';

const INIT_STATE = () => ({
  ing: 1,
  total: parseInt(isolationClearlist.length / 10) + 1,
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
    isolationClearQuestion() {
      return isolationClearlist;
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
