<template>
  <div class="content-wrap">
    <home-contents />
    <history-taking-alarm v-if="popup === 'interview'" @onAction="onHtAlarmAction" />
  </div>
</template>
<script>
import HistoryTakingAlarm from '@/components/HistoryTakingAlarm.vue';
import HomeContents from '@/components/HomeContents.vue';
import { notificaitonCommonEvent, STARTED_PUSH_CHECK } from '@/native/push';
import { mapGetters } from 'vuex';
import { GET_INTERVIEW_LIST } from '@/modules/history';
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
  computed: {
    ...mapGetters({ interviewList: GET_INTERVIEW_LIST }),
  },
  methods: {
    onHtAlarmAction(action) {
      if (action === 'submit') {
        this.$router.push({ name: 'history-taking' });
      }
      this.popup = '';
    },
  },
  watch: {
    interviewList() {
      const exist = this.interviewList.find(({ interviewStatus }) => interviewStatus === '0');
      if (exist) {
        this.popup = 'interview';
      } else {
        this.popup = '';
      }
    },
  },
};
</script>

<style></style>
