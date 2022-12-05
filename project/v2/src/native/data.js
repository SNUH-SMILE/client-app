/**
 * M.data 관련
 */

import { RUNTIME } from '@/common/config';
import { ENUM_APP_ENV } from '@/common/constants';
import Logger from '@/utils/logger';
import { extend } from '.';

/**
 * 전역데이터 핸들러
 */
export const GLOBAL_DATA = 'globalData';
extend(GLOBAL_DATA, (key, value) => {
  if (value === undefined) {
    return M.data.global(key);
  } else {
    return M.data.global(key, value);
  }
});

/**
 * 영속데이터 핸들러
 */
export const STORAGE_DATA = 'storageData';
extend(STORAGE_DATA, (key, value) => {
  if (value === undefined) {
    return M.data.storage(key);
  } else {
    return M.data.storage(key, value);
  }
});

export const PARAM_DATA = 'paramData';
extend(PARAM_DATA, (key, value) => {
  if (value === undefined) {
    return M.data.param(key);
  } else {
    return M.data.param(key, value);
  }
});
