import Vue from 'vue';
import Fragment from 'vue-fragment';
import VueDaumPostcode from 'vue-daum-postcode';
import VueYoutube from 'vue-youtube';
import AppPlugin from './app';
import ModalPlugin from './modal';

Vue.use(Fragment.Plugin);
Vue.use(ModalPlugin);
Vue.use(AppPlugin);
Vue.use(VueDaumPostcode, { scriptUrl: 'http://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js' });
Vue.use(VueYoutube);
