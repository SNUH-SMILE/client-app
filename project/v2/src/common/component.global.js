import Vue from 'vue';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import { ModalLayout } from '@/plugins/modal';
import TextField from './components/TextField.vue';

Vue.component('modal-layout', ModalLayout);
Vue.component('text-field', TextField);
Vue.component('validation-observer', ValidationObserver);
Vue.component('validation-provider', ValidationProvider);
