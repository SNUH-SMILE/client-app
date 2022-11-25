<template>
  <div class="content-wrap">
    <div class="content">
      <div class="cont-inner pd0">
        <app-notice-detail :title="detail.noticeTitle" :content="detail.noticeBody" :date="detail.noticeDateLabel" />
      </div>
    </div>
  </div>
</template>
<route>
{
  "meta": {
    "title": "공지사항"
  }
}
</route>
<script>
import AppNoticeDetail from '@/components/AppNoticeDetail.vue';
import Vue from 'vue';

export default {
  components: { AppNoticeDetail },
  beforeRouteEnter(to, from, next) {
    if (!to.params.detail) {
      Vue.$alert('잘못된 접근입니다.');
      next({ name: 'customer-notice' });
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
