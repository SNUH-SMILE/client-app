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
    <p class="ver-txt" v-if="appInfo">v{{ appInfo.app.version }}</p>
    <router-view></router-view>
  </div>
</template>
<script>
import { STORAGE_DATA } from '@/native/data';
import { RESPONSE_STATUS, STORAGE_KEYS } from '@/common/constants';
import { mapActions, mapState } from 'vuex';
import { LOGIN } from '@/modules/patient';
import { APP_RESOURCE_UPDATE, ENUM_RESOURCE_UPDATE_ACTION } from '@/native/net';
import { STATUS } from '@/native/constants';
import { APP_EXIT, APP_INFO, OPEN_BROWSER, PAGE_RELOAD } from '@/native';
export default {
  layout: 'none',
  computed: {
    ...mapState({ appInfo: 'appInfo' }),
  },
  mounted() {
    this.updateResource();
  },
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
    async updateResource() {
      try {
        const { status, message, action, payload } = await this.$nativeScript(APP_RESOURCE_UPDATE);
        if (status === STATUS.FAIL) {
          if (action === ENUM_RESOURCE_UPDATE_ACTION.UPDATE) {
            // 강제업데이트 가 필요한 경우
            const confirm = await this.$confirm(message);
            if (confirm === 'submit') {
              // 다운로드 페이지 오픈
              this.$nativeScript(OPEN_BROWSER, payload.url);
            } else {
              // 앱 종료
              this.$nativeScript(APP_EXIT);
            }
          } else if (action === ENUM_RESOURCE_UPDATE_ACTION.RETRY) {
            // 실패한 경우
            const confirm = await this.$confirm(message + '<br> 재시도하시겠습니까?');
            if (confirm === 'submit') {
              // 재시도
              this.updateResource();
            } else {
              // 앱 종료
              this.$nativeScript(APP_EXIT);
            }
          }
          return;
        }
        if (action === ENUM_RESOURCE_UPDATE_ACTION.REFRESH) {
          // 페이지 리로드
          return this.$nativeScript(PAGE_RELOAD);
        }
      } catch (error) {
        console.error(error);
        await this.$alert('알 수 없는 에러가 발생되었습니다. <br/> 증상이 반복되면 관리자에게 문의해주세요.');
        this.$nativeScript(APP_EXIT);
      }

      // 성공이면서 새로고침이 아닌 경우 다음 프로세스 진행
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
    },
  },
};
</script>
