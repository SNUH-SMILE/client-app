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
import { mapActions, mapGetters } from 'vuex';
import { GET_INTERVIEW_LIST } from '@/modules/history';
import { ACCESS_TOKEN, LOGIN_ID, SESSION } from '@/modules/patient';
import { RESPONSE_STATUS } from '@/common/constants';
import { getCoordinate } from '@/common/helpers';
import { SET_LOCATION_SERVICE_CONFIG, START_LOCATION_SERVICE } from '@/native/fgService';
import { SET_QUARANTINE_API_URL } from '@/common/config';
import { patientService } from '@/services/api';
export default {
  name: 'home',
  components: {
    HistoryTakingAlarm,
    HomeContents,
  },
  async created() {
    const pushData = this.$nativeScript(STARTED_PUSH_CHECK);
    if (pushData) notificaitonCommonEvent(pushData); // 푸시 이벤트
    try {
      const { code, data } = await this.fetchSession();
      const { address1, patientNm, birthDate, sex, cellPhone } = data;
      const { code: code2, data: data2 } = await patientService.identity(patientNm, birthDate, sex, cellPhone);
      if (code2 === RESPONSE_STATUS.SUCCESS && data2.quarantineDiv === '1' && code === RESPONSE_STATUS.SUCCESS) {
        const { lat, lng } = await getCoordinate(address1);
        this.$nativeScript(SET_LOCATION_SERVICE_CONFIG, lat, lng, this.token, this.loginId, SET_QUARANTINE_API_URL);
        this.$nativeScript(START_LOCATION_SERVICE);
      }
    } catch (err) {
      console.error(err);
      this.$toast('위치정보서비스를 시작하지 못했습니다.');
    }
  },
  data() {
    return {
      popup: '',
    };
  },
  computed: {
    ...mapGetters({ interviewList: GET_INTERVIEW_LIST, loginId: LOGIN_ID, token: ACCESS_TOKEN }),
  },
  methods: {
    ...mapActions({ fetchSession: SESSION }),
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
