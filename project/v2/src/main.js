import Vue from 'vue';
import $ from 'jquery';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import '@/validate';
import '@/plugins';
import defaultFormat from '@/common/custom.day.js';
import '@/assets/scss/morpheus-style.scss';
import '@/common/component.global'; // 전역 컴포넌트 로드
import { RESPONSE_STATUS } from '@/common/constants.js';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import '@/common/httpSend';
Vue.prototype.$response = RESPONSE_STATUS;
Vue.config.productionTip = false;
Vue.prototype.$dayjs.extend(customParseFormat);
Vue.prototype.$dayjs.extend(defaultFormat);
window.$ = window.jQuery = $;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
