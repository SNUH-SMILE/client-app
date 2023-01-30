<template>
  <div class="content-wrap">
    <div class="content bg-lgray">
      <div class="cont-inner pd0">
        <app-support-question-detail
          :title="detail.questionTitle"
          :content="detail.questionBody"
          :date="detail.questionDateLabel"
          :answerContent="detail.answerBody"
          :answerDate="detail.answerDateLabel"
        />
      </div>
    </div>
  </div>
</template>
<route>
{
  "meta": {
    "title": "문의 내역"
  }
}
</route>
<script>
import Vue from 'vue';
import AppSupportQuestionDetail from '@/modules/etc/AppSupportQuestionDetail.vue';
import _find from 'lodash/find';
import { QUESTION_LIST } from '@/modules/etc';
import { mapGetters } from 'vuex';

export default {
  components: {
    AppSupportQuestionDetail,
  },
  beforeRouteEnter(to, from, next) {
    if (!to.params.questionSeq) {
      Vue.$alert('잘못된 접근입니다.');
      next({ name: 'customer-inquiry' });
    } else {
      next();
    }
  },
  computed: {
    ...mapGetters({
      list: QUESTION_LIST,
    }),
    detail() {
      const detail = _find(this.list, { questionSeq: this.$route.params.questionSeq });
      if (!detail) {
        // eslint-disable-next-line
        this.$alert('문의내역을 찾을 수 없습니다.').then(() => {
          this.$router.replace({ name: 'customer-inquiry' });
        });
        return;
      }
      return detail;
    },
  },
};
</script>

<style></style>
