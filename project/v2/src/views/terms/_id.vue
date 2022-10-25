<template>
  <div class="content-wrap">
    <validation-observer tag="fragment">
      <div class="content">
        <div class="cont-inner mb-space30">
          <div class="terms-wrap">약관 내용이 들어갑니다.</div>
        </div>
      </div>
      <div class="btn-wrap">
        <router-link custom v-slot="{ navigate }" :to="{ name: 'agree' }">
          <button type="button" class="btn-txt navy" @click="navigate">동의</button>
        </router-link>
      </div>
    </validation-observer>
  </div>
</template>
<route>
{
  "meta": {
    "title": "IITP 자가 격리 앱 서비스 이용약관"
  }
}
</route>
<script>
const INIT_STATE = () => ({});

export default {
  data() {
    return {
      state: INIT_STATE(),
    };
  },
};
</script>

<style></style>
