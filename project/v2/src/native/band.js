/**
 * 밴드 관련
 */
import Vue from 'vue';
import { OAUTH_API_URL, RUNTIME } from '@/common/config';
import { ENUM_APP_ENV } from '@/common/constants';
import { bindGlobalCb, executor, extend, unBindGlobalCb } from '.';

const CB_BAND_SCAN = '__CB_BAND_SCAN'; // 밴드 스캔 콜백(여러번)
const CB_BAND_CONNECT = '__CB_BAND_CONNECT'; // 밴드 연결 콜백
const CB_GET_LAST_DEVICE_ID = '__CB_GET_LAST_DEVICE_ID'; // 마지막 연결 밴드 정보에 대한 콜백
const CB_GET_MAIN_ALL_DATA = '__CB_GET_MAIN_ALL_DATA';
unBindGlobalCb(CB_BAND_SCAN);
unBindGlobalCb(CB_BAND_CONNECT);
unBindGlobalCb(CB_GET_LAST_DEVICE_ID);
unBindGlobalCb(CB_GET_MAIN_ALL_DATA);

/**
 * 밴드 스캔
 */
export const ON_BAND_SCAN = 'onBandScan';
extend(ON_BAND_SCAN, (func) => {
  if (RUNTIME.TYPE === ENUM_APP_ENV.APP) {
    if (func) {
      bindGlobalCb(CB_BAND_SCAN, ({ code, message, list }) => {
        if (code !== '0000') {
          Vue.$toast(`${message}(${code})`);
        }
        func({ code, message, list });
      });
    }
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
  unBindGlobalCb(CB_BAND_SCAN);
  return M.execute('exBandScanStop');
});

/**
 * 디바이스 연결 여부
 * @return {Boolean}
 */
export const IS_BAND_CONNECT = 'isDeviceConnect';
extend(IS_BAND_CONNECT, () => {
  if (RUNTIME.TYPE === ENUM_APP_ENV.APP) {
    // T == 연결됨, F == 연결안됨.
    return M.execute('exIsBandConnect') === 'T';
  }
});

/**
 * 디바이스 연결
 * @param {String} bandAddr 밴드 주소
 * @param {String} resetType 0 : 디바이스/디비 초기화 , 1 : 디바이스 초기화 , 2 : 초기화 없음
 * @param {Function} callback
 */
export const BAND_CONNECT = 'bandConnect';
extend(BAND_CONNECT, (bandAddr, resetType = '2') => {
  if (RUNTIME.TYPE === ENUM_APP_ENV.APP) {
    return new Promise((resolve, reject) => {
      bindGlobalCb(CB_BAND_CONNECT, ({ code, message, deviceId }) => {
        if (code === '0000') resolve(deviceId);
        else {
          reject(code);
          Vue.$toast(`${message}(${code})`);
        }
        unBindGlobalCb(CB_BAND_CONNECT);
      });

      M.execute('exBandConnect', {
        schBluetooth: 'C',
        bandAddr: bandAddr,
        resetType: resetType,
        callback: CB_BAND_CONNECT,
      });
    });
  }
});

/**
 * 디바이스 연결 해제
 */
export const OFF_DEVICE_CONNECT = 'offDeviceConnect';
extend(OFF_DEVICE_CONNECT, () => {
  if (RUNTIME.TYPE === ENUM_APP_ENV.APP) {
    return M.execute('exBandDisconnect');
  }
});

/**
 * 디바이스 언어 확인
 */
export const GET_DEVICE_LANGUAGE = 'getDeviceLanguage';
extend(GET_DEVICE_LANGUAGE, () => {
  if (RUNTIME.TYPE === ENUM_APP_ENV.APP) {
    return M.execute('exWNGetBandLang'); //한국어 3
  }
});

/**
 * 마지막으로 연결된 디바이스ID
 * only Ios
 */
export const GET_LAST_DEVICE_ID = 'getLastDeviceId';
extend(GET_LAST_DEVICE_ID, () => {
  return new Promise((resolve) => {
    if (RUNTIME.TYPE === ENUM_APP_ENV.APP) {
      bindGlobalCb(CB_GET_LAST_DEVICE_ID, (...args) => {
        resolve(...args);
        unBindGlobalCb(CB_GET_LAST_DEVICE_ID);
      });
      M.execute('exLastDeviceId', CB_GET_LAST_DEVICE_ID);
    }
  });
});

/***
 * 가민 인증 페이지 이동
 */
export const OPEN_GARMIN_OAUTH = 'openGraminConnect';
extend(OPEN_GARMIN_OAUTH, (deviceId, loginId) => {
  M.page.html({
    url: `${OAUTH_API_URL}/garmin/oauth/login?deviceId=${deviceId}&loginId=${loginId}`,
    action: 'NO_HISTORY',
  });
});

/**
 * 가민 이외 전체 데이터 조회
 */

export const GET_BAND_ALL_DATA = 'getBandAllData';
extend(GET_BAND_ALL_DATA, () => {
  return new Promise((resolve, reject) => {
    if (RUNTIME.TYPE === ENUM_APP_ENV.APP) {
      if (!executor(IS_BAND_CONNECT)) reject('Not Connected Band Device');
      bindGlobalCb(CB_GET_MAIN_ALL_DATA, ({ code, message, ...data }) => {
        if (code === '0000') resolve({ code, message, data });
        else reject({ code, message, data });
        unBindGlobalCb(CB_GET_MAIN_ALL_DATA);
      });
      M.execute('exServerSyncData', CB_GET_MAIN_ALL_DATA);
    }
  });
});

export const SUCC_SYNC_BAND_DATA = 'succSyncBandData';
extend(SUCC_SYNC_BAND_DATA, () => {
  if (RUNTIME.TYPE === ENUM_APP_ENV.APP) {
    M.execute('exServerSyncDataFinish');
  }
});
