export default {
  install(Vue) {
    const eventBus = new Vue();

    // 1. 전역 메소드 또는 속성 추가
    // Vue.myGlobalMethod = function () {
    // // 필요한 로직 ...
    // };

    // 2. 전역 에셋 추가
    // Vue.directive('my-directive', {
    //   bind(el, binding, vnode, oldVnode) {
    //   // 필요한 로직 ...
    //   },
    // });

    // 3. 컴포넌트 옵션 주입
    Vue.mixin({
      data() {
        return {};
      },
      beforeCreate() {},
      created() {},
      beforeMount() {},
      activated() {},
      mounted() {},
      beforeDestroy() {},
      destroyed() {},
    });

    // 4. 인스턴스 메소드 추가
    // Vue.prototype.$myMethod = function (methodOptions) {
    // // 필요한 로직 ...
    // };

    Vue.prototype.$eventBus = eventBus;

    Vue.prototype.$log = (...args) => {
      console.log(...args);
    };
  },
};
