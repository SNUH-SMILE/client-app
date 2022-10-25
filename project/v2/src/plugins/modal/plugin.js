import _isPlainObject from 'lodash/isPlainObject';
import _merge from 'lodash/merge';
import _remove from 'lodash/remove';
import Alert from './components/Alert.vue';
import Confirm from './components/Confirm.vue';
import Toast from './components/Toast.vue';
import Loading from './components/Loading.vue';

export const createDivInBody = () => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  return div;
};

function install(Vue, option) {
  /**
   * 전역 Alert 함수
   * @param {any} options
   * @returns {Promise}
   */
  function alert(options) {
    const _options = { title: '알림', content: '' };
    if (_isPlainObject(options)) {
      _merge(_options, options);
    } else {
      _options.content = options;
    }

    return new Promise((resolve) => {
      const div = createDivInBody();
      const vm = new Vue(Alert);
      vm.title = _options.title;
      vm.content = _options.content;
      vm.onAction = function (action) {
        resolve(action);
        vm.$el.remove();
        vm.$destroy();
        _remove(Vue._modals, (target) => target === vm);
      };
      vm.$mount(div);
      Vue._modals.push(vm);
    });
  }

  /**
   * 전역 Confirm 함수
   * @param {any} options
   * @returns {Promise}
   */
  function confirm(options) {
    const _options = { title: '알림', content: '' };
    if (_isPlainObject(options)) {
      _merge(_options, options);
    } else {
      _options.content = options;
    }

    return new Promise((resolve) => {
      const div = createDivInBody();
      const vm = new Vue(Confirm);
      vm.title = _options.title;
      vm.content = _options.content;
      vm.onAction = function (action) {
        resolve(action);
        vm.$el.remove();
        vm.$destroy();
        _remove(Vue._modals, (target) => target === vm);
      };
      vm.$mount(div);
      Vue._modals.push(vm);
    });
  }

  /**
   * 전역 토스트 함수
   * @param {any} options
   * @param {number} time
   */
  function toast(options, time) {
    const _options = {
      text: '',
      time: time || 1000,
    };
    if (_isPlainObject(options)) {
      _merge(_options, options);
    } else {
      _options.text = options;
    }
    const div = createDivInBody();
    const vm = new Vue(Toast);
    vm.content = _options.text;
    vm.$mount(div);
    setTimeout(() => {
      vm.show = false;
      vm.$nextTick(() => {
        vm.$el.remove();
        vm.$destroy();
      });
    }, _options.time);
  }

  /**
   * 전역 로딩 함수
   * @param {any} options
   * @returns {VueInstance}
   */
  function loading(options) {
    const _options = {};
    const div = createDivInBody();
    const vm = new Vue(Loading);
    function hide() {
      vm.show = false;
      vm.$nextTick(() => {
        vm.$el.remove();
        vm.$destroy();
      });
    }
    vm.$hide = hide;
    vm.$mount(div);
    return vm;
  }

  Vue._modals = [];
  Vue.$alert = Vue.prototype.$alert = alert;
  Vue.$confirm = Vue.prototype.$confirm = confirm;
  Vue.$toast = Vue.prototype.$toast = toast;
  Vue.$loading = Vue.prototype.$loading = loading;
}

export default install;
