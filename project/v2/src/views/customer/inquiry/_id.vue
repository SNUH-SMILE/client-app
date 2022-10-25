<template>
  <div class="content-wrap">
    <div class="content bg-lgray">
      <div class="cont-inner pd0">
        <inquiry-detail />
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
import InquiryDetail from '@/components/InquiryDetail.vue';

const INIT_STATE = () => ({});

export default {
  components: {
    InquiryDetail,
  },
  data() {
    return {
      state: INIT_STATE(),
    };
  },
};
</script>

<style></style>
