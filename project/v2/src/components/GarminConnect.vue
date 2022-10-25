<template>
  <modal-layout title="Garmin Connect™ 연결 오류" bodyClass="pb0">
    <template slot="body">
      <p class="pop-txt pt0">기존 회원 정보로 로그인 할 수 없어 <br />서비스 이용이 불가능합니다. <br />다시 로그인해주세요.</p>
      <div class="form-box mt30">
        <validation-provider name="아이디" rules="required" immediate tag="fragment">
          <text-field id="id" label="아이디" v-model="state.id" />
        </validation-provider>
        <validation-provider name="비밀번호" rules="required" immediate tag="fragment">
          <text-field id="pw" type="password" label="비밀번호" v-model="state.pw">
            <template slot="noti">
              <p class="ipt-txt error">회원 정보가 일치하지 않습니다.</p>
            </template>
          </text-field>
        </validation-provider>
      </div>
      <div class="gray-info-box">
        <ul class="dot-list">
          <li>가민 회원 가입 및 아이디/비밀번호 찾기 기능은 Garmin Connect™ 앱에서 지원합니다.</li>
        </ul>
      </div>
    </template>
    <template slot="foot">
      <div class="btn-wrap">
        <button type="button" class="btn-txt white" @click="$emit('onClose')">다음에 로그인하기</button>
        <button type="button" class="btn-txt blue" @click="$emit('onClose')">지금 로그인하기</button>
      </div>
    </template>
  </modal-layout>
  <!-- <toast text="아이디/비밀번호를 모두 입력해주세요." /> -->
</template>

<script>
const INIT_STATE = () => ({
  id: '',
  pw: '',
});

export default {
  data() {
    return {
      state: INIT_STATE(),
    };
  },
  methods: {
    next() {
      this.$router.replace({ name: '' });
    },
    onSubmit() {
      this.$emit('onSubmit');
      this.$emit('onClose');
    },
  },
};
</script>

<style></style>
