<template>
  <div class="login-wrap">
    <validation-observer tag="fragment" v-slot="{ invalid }">
      <div class="login-info">
        <h1 class="logo">
          <span class="txt-blind">SMILE</span>
        </h1>
        <p class="txt">어려움을 이겨내고 <br />평범한 일상에 함께 할 수 있기를 기원합니다.</p>
      </div>
      <div class="login-form">
        <validation-provider name="아이디" rules="required" immediate tag="fragment">
          <text-field label="아이디" v-model="state.loginId" />
        </validation-provider>
        <validation-provider name="비밀번호" rules="required" immediate tag="fragment">
          <text-field :type="showPassword ? 'text' : 'password'" label="비밀번호" v-model="state.password">
            <!-- 비밀번호 토글 class="show" 추가/삭제 -->
            <button @click="togglePw" type="button" class="btn-pw-show" :class="{ show: showPassword }">
              <span class="txt-blind">비밀번호 보기</span>
            </button>
          </text-field>
        </validation-provider>
        <div class="form-chk">
          <!-- 무조건 자동로그인 처리 -->
          <!-- <p class="ipt-chk">
            <input type="checkbox" title="" id="chk01" v-model="state.saveId" />
            <label for="chk01">아이디 저장</label>
          </p> -->
          <!-- <p class="ipt-chk">
            <input type="checkbox" title="" id="chk02" v-model="state.autoLogin" />
            <label for="chk02">자동 로그인</label>
          </p> -->
        </div>
        <div class="btn-wrap">
          <button type="button" class="btn-txt navy" :disabled="invalid" @click="onSubmit">로그인</button>
        </div>
        <div class="divide-list">
          <router-link custom v-slot="{ navigate }" :to="{ name: 'find' }">
            <button type="button" class="btn-link gray" @click="navigate">아이디 / 비밀번호 찾기</button>
          </router-link>
          <router-link custom v-slot="{ navigate }" :to="{ name: 'terms' }">
            <button type="button" class="btn-link blue" @click="navigate">회원가입</button>
          </router-link>
        </div>
      </div>
    </validation-observer>
  </div>
</template>
<script>
import { DEVICE_INFO, LOGIN } from '@/modules/patient';
import { mapActions, mapGetters } from 'vuex';
import { MODE } from '@/common/config';
import { ENUM_MODE, RESPONSE_STATUS, STORAGE_KEYS } from '@/common/constants';
import { STORAGE_DATA } from '@/native/data';
const INIT_STATE = () => ({
  loginId: '',
  password: '',
});

const INIT_DEV_STATE = () => ({
  loginId: 'testdy',
  password: '0000',
});

export default {
  layout: 'none',
  components: {},

  data() {
    return {
      // state: MODE === ENUM_MODE.PROD ? INIT_STATE() : INIT_DEV_STATE(),
      state: INIT_STATE(),
      showPassword: false, //비밀번호 보기
    };
  },
  computed: {
    ...mapGetters({ deviceInfo: DEVICE_INFO }),
  },
  methods: {
    ...mapActions({ login: LOGIN, fetchDevice: DEVICE_INFO }),
    async onSubmit() {
      const { loginId, password } = this.state;
      const { code, message } = await this.login({ loginId, password });
      if (RESPONSE_STATUS.SUCCESS === code) {
        try {
          await this.fetchDevice();
        } catch (error) {
          // error ignore
        }

        if (this.deviceInfo.deviceId) {
          // 기등록한 밴드(디바이스)가 존재하는 경우
          this.$router.replace({ name: 'home' });
        } else {
          // 존재하지 않는 경우
          this.$router.replace({ name: 'home', params: { noDevice: true } });
        }
      }
    },
    togglePw() {
      this.showPassword = !this.showPassword;
    },
  },
};
</script>

<style></style>
