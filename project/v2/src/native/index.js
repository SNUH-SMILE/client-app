const events = {};

export const extend = (key, func) => {
  events[key] = func;
};

export const executor = (key, ...args) => {
  // 방어코드 또는 커스텀 에러를 통한 처리 필요
  const callEvent = events[key];
  if (typeof callEvent !== 'function') throw new Error(`${key} is not defind native script key.`);
  return events[key](...args);
};
