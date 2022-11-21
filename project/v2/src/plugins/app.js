import dayjs from 'dayjs';
import lodash from 'lodash';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import defaultFormat from '@/common/custom.day';
import { executor } from '@/native';

/**
 * dayjs 확장
 */

dayjs.extend(customParseFormat);
dayjs.extend(defaultFormat);

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

    // 전역 으로 선언한거 여기다가 넣기
    Vue.prototype.$dayjs = dayjs;
    Vue.prototype.$eventBus = eventBus;

    Vue.prototype.$lodash = lodash;

    Vue.prototype.$nativeScript = executor;
  },
};
