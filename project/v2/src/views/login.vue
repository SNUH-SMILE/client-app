<template>
  <div class="login-wrap">
    <validation-observer tag="fragment">
      <div class="login-info">
        <h1 class="logo">
          <span class="txt-blind">SMILE</span>
        </h1>
        <p class="txt">어려움을 이겨내고 <br />평범한 일상에 함께 할 수 있기를 기원합니다.</p>
      </div>
      <div class="login-form">
        <validation-provider name="아이디" rules="required" immediate tag="fragment">
          <text-field id="id" label="아이디" v-model="state.id" :reset="showReset" />
        </validation-provider>
        <validation-provider name="비밀번호" rules="required" immediate tag="fragment">
          <text-field type="password" id="pw" label="비밀번호" :reset="true" v-model="state.pw">
            <!-- 비밀번호 토글 class="show" 추가/삭제 -->
            <button type="button" class="btn-pw-show" :class="{ show: showPassword }">
              <span class="txt-blind">비밀번호 보기</span>
            </button>
          </text-field>
        </validation-provider>
        <div class="form-chk">
          <p class="ipt-chk">
            <input type="checkbox" title="" id="chk01" v-model="state.saveId" />
            <label for="chk01">아이디 저장</label>
          </p>
          <p class="ipt-chk">
            <input type="checkbox" title="" id="chk02" v-model="state.autoLogin" />
            <label for="chk02">자동 로그인</label>
          </p>
        </div>
        <div class="btn-wrap">
          <router-link custom v-slot="{ navigate }" :to="{ name: 'home' }" replace>
            <button type="button" class="btn-txt navy" @click="navigate">로그인</button>
          </router-link>
        </div>
        <div class="divide-list">
          <router-link custom v-slot="{ navigate }" :to="{ name: 'find' }">
            <button type="button" class="btn-link gray" @click="navigate">아이디 / 비밀번호 찾기</button>
          </router-link>
          <router-link custom v-slot="{ navigate }" :to="{ name: 'join' }">
            <button type="button" class="btn-link blue" @click="navigate">회원가입</button>
          </router-link>
        </div>
      </div>
    </validation-observer>
  </div>
</template>
<script>
const INIT_STATE = () => ({
  id: '',
  pw: '',
  saveId: false,
  autoLogin: false,
});

export default {
  layout: 'none',
  data() {
    return {
      state: INIT_STATE(),
      showReset: false, //인풋 초기화 버튼
      showPassword: false, //비밀번호 보기
    };
  },
  created() {},
};
</script>

<style></style>
