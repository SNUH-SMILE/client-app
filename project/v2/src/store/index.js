import Vue from 'vue';
import Vuex from 'vuex';
import _debounce from 'lodash/debounce';
import * as modules from '@/modules';
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    isMobile: document.documentElement.clientWidth < 768,
  },
  getters: {},
  mutations: {
    setIsMobile(state, payload) {
      state.isMobile = payload;
    },
  },
  actions: {},
  modules,
});

const onChangeSize = _debounce(() => {
  const width = document.documentElement.clientWidth;
  if (width > 768 && store.state.isMobile) {
    // table
    store.commit('setIsMobile', false);
  } else if (width < 768 && !store.state.isMobile) {
    // mobile
    store.commit('setIsMobile', true);
  }
}, 0);

window.removeEventListener('resize', onChangeSize);
window.addEventListener('resize', onChangeSize);

export default store;
