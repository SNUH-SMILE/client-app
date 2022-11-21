/**
 * BlueTooth 관련
 * 디바이스 연결
 */

import { RUNTIME } from '@/common/config';
import { ENUM_APP_ENV } from '@/common/constants';
import Logger from '@/utils/logger';
import { extend } from '.';
const logger = new Logger('Native Bluetooth');

/**
 * 위치 서비스 시작
 * @param {String} id
 * @param {String} url
 */
export const ON_BACKGROUND_SERVICE = 'onBackgroundService';
extend(ON_BACKGROUND_SERVICE, (id, url) => {
  if (RUNTIME.TYPE === ENUM_APP_ENV.APP) {
    M.execute('exLocationStart', id, url);
  }
});

/**
 * 위치 서비스 종료
 */
export const OFF_BACKGROUND_SERVICE = 'offBackgroundService';
extend(OFF_BACKGROUND_SERVICE, () => {
  if (RUNTIME.TYPE === ENUM_APP_ENV.APP) {
    M.execute('exLocationStop');
  }
});

/**
 * 포그라운드 시작
 */
export const ON_FOREGROUND_SERVICE = 'onForegroundService';
extend(ON_FOREGROUND_SERVICE, () => {
  if (RUNTIME.TYPE === ENUM_APP_ENV.APP) {
    M.execute('exForeGroundStart');
  }
});

/**
 * 포그라운드 종료
 */
export const OFF_FOREGROUND_SERVICE = 'offForegroundService';
extend(ON_FOREGROUND_SERVICE, () => {
  if (RUNTIME.TYPE === ENUM_APP_ENV.APP) {
    M.execute('exForeGroundStop');
  }
});

/**
 * 내 위치 수신 시작
 */
export const ON_CURRENT_LOCATION = 'onCurrentLocation';
extend(ON_CURRENT_LOCATION, () => {
  if (RUNTIME.TYPE === ENUM_APP_ENV.APP) {
    M.execute('exWnCurrentLocationStart');
  }
});
