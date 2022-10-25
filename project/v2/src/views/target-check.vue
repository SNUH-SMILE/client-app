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
        <validation-provider name="성명" rules="required" immediate tag="fragment">
          <text-field v-model="state.name" id="name" label="성명" reset />
        </validation-provider>
        <validation-provider name="생년월일" rules="required" immediate tag="fragment">
          <text-field id="birth" label="생년월일" type="number" placeholder="6자리 입력 (920812)" v-model="state.birth" reset />
        </validation-provider>
        <validation-provider name="휴대폰 번호" rules="required" immediate tag="fragment">
          <text-field id="phone" label="휴대폰 번호" type="number" placeholder="(-)구분 없이 입력" v-model="state.phone" reset />
        </validation-provider>
        <div class="form-item">
          <label for="gender" class="form-ttl">성별</label>
          <div class="ipt-rdo-box count02">
            <p class="ipt-rdo">
              <input type="radio" name="gender" id="gender01" value="M" v-model="state.gender" checked />
              <label for="gender01">남</label>
            </p>
            <p class="ipt-rdo">
              <input type="radio" name="gender" id="gender02" value="F" v-model="state.gender" />
              <label for="gender02">여</label>
            </p>
          </div>
        </div>
        <div class="btn-wrap">
          <router-link custom v-slot="{ navigate }" :to="{ name: 'join' }" replace>
            <button type="button" class="btn-txt navy" @click="navigate">대상자 확인</button>
          </router-link>
        </div>
      </div>
    </validation-observer>
  </div>
</template>

<script>
const INIT_STATE = () => ({
  name: '',
  birth: '',
  phone: '',
  gender: 'M',
});

export default {
  data() {
    return {
      state: INIT_STATE(),
      showReset: false, //인풋 초기화 버튼
    };
  },
};
</script>

<style></style>
