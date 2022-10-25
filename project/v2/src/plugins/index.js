import Vue from 'vue';
import Fragment from 'vue-fragment';
import AppPlugin from './app';
import ModalPlugin from './modal';

Vue.use(Fragment.Plugin);
Vue.use(ModalPlugin);
Vue.use(AppPlugin);
