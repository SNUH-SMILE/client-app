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

export default {
  components: {
    AppSupportQuestionDetail,
  },
  beforeRouteEnter(to, from, next) {
    if (!to.params.detail) {
      Vue.$alert('잘못된 접근입니다.');
      next({ name: 'customer-inquiry' });
    } else {
      next();
    }
  },
  computed: {
    detail() {
      return this.$route.params.detail;
    },
  },
};
</script>

<style></style>
