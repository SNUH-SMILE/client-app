<template>
  <div class="content-wrap">
    <div class="content">
      <div class="cont-inner pd0">
        <notice-detail />
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
import NoticeDetail from '@/components/NoticeDetail.vue';

const INIT_STATE = () => ({});

export default {
  components: {
    NoticeDetail,
  },
  data() {
    return {
      state: INIT_STATE(),
    };
  },
};
</script>

<style></style>
