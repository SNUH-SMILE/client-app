import Vue from 'vue';
import $ from 'jquery';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import '@/validate';
import '@/plugins';
import '@/assets/scss/morpheus-style.scss';
import '@/common/component.global'; // 전역 컴포넌트 로드

Vue.config.productionTip = false;

window.$ = window.jQuery = $;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
