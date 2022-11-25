<template>
  <div class="content-wrap">
    <validation-observer slim v-slot="{ invalid }">
      <div class="content">
        <div class="cont-inner">
          <div class="img-info-box img-pw">
            <p class="img-info-txt"><em class="iht txtc-blue">비빌번호를 변경</em>해 <br class="tb-none" />주세요.</p>
          </div>
          <div class="form-box mb-space30">
            <validation-provider name="새 비밀번호" rules="required" vid="password" slim v-slot="{ errors }">
              <text-field id="pw" class="tb-inblock" type="password" label="새 비밀번호" v-model="state.pw" :errorMsgs="[errors[0]]"></text-field>
            </validation-provider>
            <validation-provider name="비밀번호 확인" rules="required|confirmed:password" slim v-slot="{ errors }">
              <text-field id="pwChk" class="tb-inblock" type="password" label="비밀번호 확인" v-model="state.pw2" :errorMsgs="[errors[0]]">
              </text-field>
            </validation-provider>
          </div>
        </div>
      </div>

      <div class="btn-wrap">
        <button type="button" class="btn-txt navy" :disabled="invalid" @click="onSubmit">변경 완료</button>
      </div>
    </validation-observer>
  </div>
</template>

<route>
{
  "meta": {
    "title": "비밀번호 재설정"
  }
}
</route>
<script>
import Vue from 'vue';
import { patientService } from '@/services/api';
const INIT_STATE = () => ({
  pw: '',
  pw2: '',
});

export default {
  data() {
    return {
      state: INIT_STATE(),
    };
  },
  beforeRouteEnter(to, from, next) {
    if (to.params.loginId) return next();
    Vue.$alert('잘못된 접근입니다.');
    next({ name: 'find' });
  },
  methods: {
    async onSubmit() {
      const { pw: password } = this.state;
      const { loginId } = this.$route.params;
      const { code, message, data } = await patientService.chnagePassword(loginId, password);
      await this.$alert('비밀번호가 변경되었습니다.');
      this.$router.replace({ name: 'login' });
    },
  },
};
</script>

<style></style>
