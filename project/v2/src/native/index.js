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
