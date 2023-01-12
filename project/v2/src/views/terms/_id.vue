<template>
  <div class="content-wrap">
    <div class="content">
      <div class="cont-inner mb-space30">
        <div class="terms-wrap" v-html="getTerms()"></div>
      </div>
    </div>
    <div class="btn-wrap">
      <router-link custom v-slot="{ navigate }" :to="{ name: 'terms', params: { agree: true } }" replace>
        <button type="button" class="btn-txt navy" @click="navigate">동의</button>
      </router-link>
    </div>
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
import { APP_DATA, INFO_DATA } from '@/modules/etc/terms.js';
const INIT_STATE = () => ({
  APP_DATA,
  INFO_DATA,
});
const termsData = {
  app: APP_DATA,
  info: INFO_DATA,
};
export default {
  data() {
    return {
      state: INIT_STATE(),
    };
  },
  methods: {
    getTerms() {
      return termsData[this.$route.params.id];
    },
  },
};
</script>

<style></style>
