<template>
  <div class="intro-wrap">
    <div class="center-box">
      <h1 class="logo-box">
        <span class="logo">
          <span class="txt-blind">SMILE</span>
        </span>
        <span class="app-txt"><strong>자가격리</strong> APP</span>
      </h1>
      <div class="loading">
        <img src="@/assets/img/img-loading.png" alt="" />
      </div>
    </div>
    <p class="ver-txt">v1.0</p>
    <router-view></router-view>
  </div>
</template>
<script>
import { STORAGE_DATA } from '@/native/data';
import { RESPONSE_STATUS, STORAGE_KEYS } from '@/common/constants';
import { mapActions } from 'vuex';
import { LOGIN } from '@/modules/patient';
export default {
  layout: 'none',
  methods: {
    ...mapActions({ login: LOGIN }),
    haveAllPermission() {
      //TODO: 위치, 마이크, 블루투스 권한
      // TODO 여기 있을것이 아니라 계속 요청해야함
      console.log('저는 위치, 마이크, 블루투스 권한을 가지고 있습니다.');
      return true;
    },
    havePushPermission() {
      //TODO : 체크하기
      // TODO 여기 있을것이 아니라 계속 요청해야함
      console.log('저는 푸시 권한을 가지고 있습니다.');
      return true;
    },
  },
  mounted() {
    setTimeout(async () => {
      // if (!this.haveAllPermission()) {
      //   return this.$router.replace({ name: 'intro-permission' });
      // }
      // if (!this.havePushPermission()) {
      //   return this.$router.replace({ name: 'intro-push' });
      // }
      const saveInput = this.$nativeScript(STORAGE_DATA, STORAGE_KEYS.SAVE_LOGIN_INPUT);
      if (saveInput) {
        const { loginId, password } = saveInput;
        const { code, message } = await this.login({ loginId, password });
        if (RESPONSE_STATUS.SUCCESS === code) {
          this.$router.replace({ name: 'home' });
        }
      } else {
        return this.$router.replace({ name: 'login' });
      }
    }, 1000);
  },
};
</script>
