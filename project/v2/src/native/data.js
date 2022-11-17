/**
 * M.data 관련
 */

import { RUNTIME } from '@/common/config';
import { ENUM_APP_ENV } from '@/common/constants';
import Logger from '@/utils/logger';
import { extend } from '.';
const logger = new Logger('M Global Data');

/**
 * 변수 등록
 * @param {String} key
 * @param {String} value
 */
export const SET_GLOBAL_DATA = 'setGlobalData';
extend(SET_GLOBAL_DATA, (key, value) => {
  if (RUNTIME.TYPE === ENUM_APP_ENV.APP) {
    M.data.global(key, value);
  }
});

/**
 * 변수 조회
 * @param {String} key
 */
export const GET_GLOBAL_DATA = 'getGlobalData';
extend(GET_GLOBAL_DATA, (key) => {
  if (RUNTIME.TYPE === ENUM_APP_ENV.APP) {
    M.data.global(key);
  }
});

/**
 * 변수 삭제
 * @param {String} key
 */
export const REMOVE_GLOBAL_DATA = 'REMOVE_GLOBAL_DATA';
extend(REMOVE_GLOBAL_DATA, (key) => {
  M.data.removeGlobal(key);
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
