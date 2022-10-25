<template>
  <div class="content-wrap">
    <validation-observer tag="fragment">
      <div class="content">
        <div class="cont-inner">
          <div class="img-info-box img-pw">
            <p class="img-info-txt"><em class="iht txtc-blue">비빌번호를 변경</em>해 <br class="tb-none" />주세요.</p>
          </div>
          <div class="form-box mb-space30">
            <validation-provider name="새 비밀번호" rules="required" immediate tag="fragment">
              <text-field id="pw" class="tb-inblock" type="password" label="새 비밀번호" v-model="state.pw"></text-field>
            </validation-provider>
            <validation-provider name="비밀번호 확인" immediate tag="fragment">
              <text-field id="pwChk" class="tb-inblock" type="password" label="비밀번호 확인" v-model="state.pw2">
                <template slot="noti">
                  <p class="ipt-txt error">비밀번호가 일치하지 않습니다.</p>
                </template>
              </text-field>
            </validation-provider>
          </div>
        </div>
      </div>

      <div class="btn-wrap">
        <router-link custom v-slot="{ navigate }" :to="{ name: 'login' }">
          <button type="button" class="btn-txt navy" @click="navigate">변경 완료</button>
        </router-link>
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
};
</script>

<style></style>
