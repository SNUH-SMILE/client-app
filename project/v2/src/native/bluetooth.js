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
 * 밴드 스캔 콜백
 */
let _scanCallback = null;
const CB_BAND_SCAN = '__CB_BAND_SACN'; // scanResult 인데 저걸로 써도 되는지?
window[CB_BAND_SCAN] = function (result) {
  logger.info('CB_BAND_SCAN : ', result);
  // TODO : 필요한 경우 데이터 핸들러 작성
  if (typeof _scanCallback === 'function') {
    _scanCallback(result);
  } else {
    logger.warn('unBind Callback : "_scanCallback"');
  }
};

/**
 * 밴드 스캔
 */
export const ON_BAND_SCAN = 'onBandScan';
extend(ON_BAND_SCAN, (cb) => {
  _scanCallback = cb;
  if (RUNTIME.TYPE === ENUM_APP_ENV.APP) {
    M.execute('exBandScan', {
      schBluetooth: 'C',
      callback: CB_BAND_SCAN,
    });
  }
});

/**
 * 밴드 스캔 중지
 */
export const OFF_BAND_SCAN = 'offBandScan';
extend(OFF_BAND_SCAN, () => {
  _scanCallback = null;
  M.execute('exBandScanStop');
});

/**
 * 디바이스 연결 콜백
 */
let _deviceConnect = null;
export const CB_DEVICE_CONNECT = 'connectResult'; // 콜백 네임 변경 불가
window[CB_DEVICE_CONNECT] = (...args) => {
  if (typeof _deviceConnect === 'function') {
    _deviceConnect(...args);
  } else {
    logger.warn('unBind Callback : "_scanCallback"');
  }
};

/**
 * 디바이스 연결 여부
 * @return {Boolean}
 */
export const IS_DEVICE_CONNECT = 'isDeviceConnect';
extend(IS_DEVICE_CONNECT, () => {
  if (RUNTIME.TYPE === ENUM_APP_ENV.APP) {
    return M.execute('exIsBandConnect') === 'T';
  }
});

/**
 * 디바이스 연결
 * @param {String} bandAddr 밴드 주소
 * @param {String} resetType 0 : 디바이스/디비 초기화 , 1 : 디바이스 초기화 , 2 : 초기화 없음
 * @param {Function} callback
 */
export const ON_DEVICE_CONNECT = 'onDeviceConnect';
extend(ON_DEVICE_CONNECT, (bandAddr, resetType, callback) => {
  if (RUNTIME.TYPE === ENUM_APP_ENV.APP) {
    _deviceConnect = callback;
    M.execute('exBandConnect', {
      schBluetooth: 'C',
      bandAddr: bandAddr,
      resetType: resetType,
      callback: CB_DEVICE_CONNECT,
    });
  }
});

/**
 * 디바이스 연결 해제
 */
export const OFF_DEVICE_CONNECT = 'offDeviceConnect';
extend(OFF_DEVICE_CONNECT, () => {
  if (RUNTIME.TYPE === ENUM_APP_ENV.APP) {
    M.execute('exBandDisconnect');
  }
});

/**
 * 디바이스 언어 확인
 */
export const GET_DEVICE_LANGUAGE = 'getDeviceLanguage';
extend(GET_DEVICE_LANGUAGE, () => {
  if (RUNTIME.TYPE === ENUM_APP_ENV.APP) {
    M.execute('exWNGetBandLang'); //한국어 3
  }
});

const CB_GET_LAST_DEVICE_ID = 'lastDeviceIdCallback';
window[CB_GET_LAST_DEVICE_ID] = (...args) => {
  // TODO callback 함수 작성
};

/**
 * 마지막으로 연결된 디바이스ID
 */
export const GET_LAST_DEVICE_ID = 'getLastDeviceId';
extend(GET_LAST_DEVICE_ID, () => {
  if (RUNTIME.TYPE === ENUM_APP_ENV.APP) {
    M.execute('exLastDeviceId', CB_GET_LAST_DEVICE_ID);
  }
});

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
