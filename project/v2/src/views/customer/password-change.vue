<template>
  <div class="content-wrap">
    <validation-observer slim v-slot="{ invalid, handleSubmit }">
      <form @submit.prevent="handleSubmit(onSubmit)">
        <div class="content">
          <div class="cont-inner mb-space30 tb-full">
            <div class="form-box tb-half">
              <div class="form-item block">
                <text-field id="id" label="아이디" :value="loginId" disabled />
              </div>
              <div class="form-item tb-inblock">
                <text-field id="name" label="성명" disabled :value="userInfo.patientNm" />
              </div>
              <div class="form-item tb-inblock">
                <text-field
                  id="birth"
                  class="tb-inblock"
                  type="number"
                  :value="userInfo.birthDate"
                  label="생년월일"
                  placeholder="6자리 입력 (920812)"
                  disabled
                >
                  <template>
                    <p class="ipt-rdo-switch disabled">
                      <input type="radio" name="gender" id="gender01" v-model="userInfo.sex" value="M" disabled />
                      <label for="gender01">남</label>
                      <input type="radio" name="gender" id="gender02" v-model="userInfo.sex" value="F" disabled />
                      <label for="gender02">여</label>
                    </p>
                  </template>
                </text-field>
              </div>
              <validation-provider name="비밀번호" rules="required" vid="password" slim v-slot="{ errors }">
                <text-field
                  id="pw"
                  class="tb-inblock"
                  type="password"
                  label="비밀번호"
                  v-model="state.password"
                  :errorMsgs="[errors[0]]"
                ></text-field>
              </validation-provider>
              <validation-provider name="비밀번호 확인" rules="required|confirmed:password" slim v-slot="{ errors }">
                <text-field
                  id="pwChk"
                  class="tb-inblock"
                  type="password"
                  label="비밀번호 확인"
                  v-model="state.confirmPassword"
                  :errorMsgs="[errors[0]]"
                ></text-field>
              </validation-provider>
            </div>
          </div>
        </div>
        <div class="btn-wrap">
          <button type="submit" class="btn-txt navy" :disabled="invalid">수정</button>
        </div>
      </form>
    </validation-observer>
  </div>
</template>
<route>
{
  "meta": {
    "title": "비밀번호 변경"
  }
}
</route>
<script>
import { LOGIN_ID, SESSION } from '@/modules/patient';
import { mapActions, mapGetters } from 'vuex';
import { patientService } from '@/services/api';
const INIT_STATE = () => ({
  password: '',
  confirmPassword: '',
});

export default {
  components: {},
  data() {
    return {
      state: INIT_STATE(),
    };
  },
  created() {
    this.fetchUserInfo();
  },
  computed: {
    ...mapGetters({ userInfo: SESSION, loginId: LOGIN_ID }),
  },
  methods: {
    ...mapActions({
      fetchUserInfo: SESSION,
    }),
    async onSubmit() {
      await patientService.chnagePassword(this.loginId, this.state.password);
      await this.$alert('비밀번호가 변경 되었습니다.');
      this.$router.back();
    },
  },
};
</script>

<style></style>
