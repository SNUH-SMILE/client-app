import { RUNTIME } from '@/common/config';
import { ENUM_APP_ENV } from '@/common/constants';
import Logger from '@/utils/logger';
const logger = new Logger('Native Core');

const events = {};

export const extend = (key, func) => {
  events[key] = func;
};

export const executor = (key, ...args) => {
  // 방어코드 또는 커스텀 에러를 통한 처리 필요
  const callEvent = events[key];
  if (typeof callEvent !== 'function') throw new Error(`${key} is not defind native script key.`);
  logger.log(`Execute KEY :: ${key}, params ::`, args);
  const result = events[key](...args);
  logger.log(`Execute KEY :: ${key}, result ::`, result);
  return result;
};

export const bindGlobalCb = (key, func) => {
  window[key] = (...args) => {
    logger.log(`Callback  KEY :: ${key}, args`, args);
    func(...args);
  };
};

export const unBindGlobalCb = (key) => {
  window[key] = (...args) => {
    logger.warn(`${key} :: unBind ! check proceess`, args);
  };
};

export const OPEN_BROWSER = 'openBrowser';
extend(OPEN_BROWSER, (url) => {
  if (RUNTIME.TYPE === ENUM_APP_ENV.APP) {
    return M.apps.browser(url);
  }
});

export const APP_EXIT = 'appExit';
extend(APP_EXIT, () => {
  if (RUNTIME.TYPE === ENUM_APP_ENV.APP) {
    return M.sys.exit();
  }
});

export const PAGE_RELOAD = 'pageRefesh';
extend(PAGE_RELOAD, () => {
  if (RUNTIME.TYPE === ENUM_APP_ENV.APP) {
    return M.page.replace();
  }
});

const INIT_APP_INFO = () => ({
  app: {
    id: 'iitp.infection.pm',
    name: '자가격리APP',
    version: 'unknown',
  },
  resource: {
    current_version: '000000',
    default_version: '000000',
    last_update_date: '',
  },
  manifest: {
    resource: {
      target: 'app',
    },
  },
});
export const APP_INFO = 'appInfo';
extend(APP_INFO, () => {
  if (RUNTIME.TYPE === ENUM_APP_ENV.APP) {
    return M.info.app() || INIT_APP_INFO();
  }
  return INIT_APP_INFO();
});
