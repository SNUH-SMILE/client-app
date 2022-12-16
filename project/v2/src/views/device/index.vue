<template>
  <div class="content-wrap">
    <div class="content">
      <div class="cont-inner">
        <h1 class="ttl-m mb-space30">가지고 계신 기기를 <br /><span class="txtc-blue">연결</span>해 주세요.</h1>
        <ul class="btn-line-list">
          <li>
            <button type="button" @click="openGarminConnect">가민 기기 연결하기</button>
          </li>
          <li>
            <router-link custom v-slot="{ navigate }" :to="{ name: 'device-list' }">
              <button type="button" @click="navigate">다른 기기 연결하기</button>
            </router-link>
          </li>
        </ul>
        <div class="center mt120">
          <router-link custom v-slot="{ navigate }" :to="{ name: 'device-help' }">
            <button type="button" class="btn-info" @click="navigate">가민 기기 연결 도움말</button>
          </router-link>
        </div>
      </div>
    </div>

    <div class="btn-wrap">
      <router-link custom v-slot="{ navigate }" :to="{ name: 'home' }" replace>
        <button type="button" class="btn-txt navy" @click="navigate">다음에 연결하기</button>
      </router-link>
    </div>
  </div>
</template>

<route>
{
  "meta": {
    "title": "기기 연결하기"
  }
}
</route>
<script>
import { mapGetters } from 'vuex';
import { LOGIN_ID } from '@/modules/patient';
import { OPEN_GARMIN_OAUTH } from '@/native/band';
import { BIND_RESTORE_EVENT, UNBIND_RESTORE_EVENT } from '@/native/cycle';
import { PARAM_DATA } from '@/native/data';
import { patientService } from '@/services/api';
const INIT_STATE = () => ({});

export default {
  data() {
    return {
      state: INIT_STATE(),
    };
  },
  computed: {
    ...mapGetters({ loginId: LOGIN_ID }),
  },
  created() {
    this.$nativeScript(BIND_RESTORE_EVENT, this.garminConnectResult);
  },
  beforeDestroy() {
    this.$nativeScript(UNBIND_RESTORE_EVENT, this.garminConnectResult);
  },
  methods: {
    garminConnectResult() {
      const { code, message } = this.$nativeScript(PARAM_DATA, 'params.garminAuthResult');
      if (code === '200') {
        this.$alert('가민 연동을 완료하였습니다.');
        patientService.device(this.loginId, [{ deviceId: this.loginId, deviceNm: 'garmin' }]);
      } else {
        this.$alert(`${message || '가민 연동을 실패하였습니다.'}(${code})`);
      }
      this.$nativeScript(PARAM_DATA, 'params', {});
    },
    async openGarminConnect() {
      await this.$alert('가민 연동을 시작합니다.');
      this.$nativeScript(OPEN_GARMIN_OAUTH, this.loginId, this.loginId);
    },
  },
};
</script>

<style></style>
