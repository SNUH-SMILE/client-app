<template>
  <div class="content-wrap">
    <div class="content">
      <div class="cont-inner pt0 tb-w100p">
        <app-patient-notice-list />
      </div>
    </div>
  </div>
</template>
<route>
{
  "meta": {
    "title": "알림"
  }
}
</route>
<script>
import AppPatientNoticeList from '@/modules/etc/AppPatientNoticeList.vue';

export default {
  components: {
    AppPatientNoticeList,
  },
};
</script>

<style></style>
