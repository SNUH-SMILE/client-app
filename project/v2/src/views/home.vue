<template>
  <div class="content-wrap">
    <home-contents />
    <history-taking-alarm v-if="popup === 'alarm'" @onAction="onHtAlarmAction" />
  </div>
</template>
<script>
import HistoryTakingAlarm from '@/components/HistoryTakingAlarm.vue';
import HomeContents from '@/components/HomeContents.vue';
import { notificaitonCommonEvent, STARTED_PUSH_CHECK } from '@/native/push';
export default {
  name: 'home',
  components: {
    HistoryTakingAlarm,
    HomeContents,
  },
  created() {
    // TODO: 푸시 클릭을 통해 진입하는 경우에 대한 콜백 처리, 상세 액션을 정의해야함.
    const pushData = this.$nativeScript(STARTED_PUSH_CHECK);
    if (pushData) notificaitonCommonEvent(pushData);
  },
  data() {
    return {
      popup: '',
    };
  },
  methods: {
    onHtAlarmAction(action) {
      this.popup = '';
    },
  },
};
</script>

<style></style>
