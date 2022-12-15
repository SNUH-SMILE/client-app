/**
 * 앱 포그라운드/백그라운드 서비스 관련 확장 함수 정의
 */

import { RUNTIME } from '@/common/config';
import { ENUM_APP_ENV, STORAGE_KEYS } from '@/common/constants';
import { executor, extend } from '.';
import { STORAGE_DATA } from './data';

export const START_LOCATION_SERVICE = 'startLocationService';
extend(START_LOCATION_SERVICE, () => {
  if (RUNTIME.TYPE === ENUM_APP_ENV.APP) {
    M.execute(START_LOCATION_SERVICE);
  }
});

/**
 * 
 * STORAGE 키 : LOCATION_SERVICE_CONFIG
1) 위도 / 경도 (필수)  LAT / LNG
2) 토근 / 로그인아이디 (필수) TOKEN / LOGIN_ID
3) 호출할 API URL (필수) API_URL
4) 이탈기준거리 (선택 / 기본 30) 단위 : 미터  DISTANCE
5) 호출 주기 (선택 / 기본 10) 단위 : 분 INTERVAL
 */

export const SET_LOCATION_SERVICE_CONFIG = 'setLocationServiceConfig';
extend(SET_LOCATION_SERVICE_CONFIG, (lat, lng, token, loginId, apiUrl, distance = '30', interval = '10') => {
  executor(STORAGE_DATA, STORAGE_KEYS.LOCATION_SERVICE_CONFIG, {
    LAT: lat,
    LNG: lng,
    TOKEN: token,
    LOGIN_ID: loginId,
    API_URL: apiUrl,
    DISTANCE: distance,
    INTERVAL: interval,
  });
});

export const CLEAR_LOCATION_SERVICE_CONFIG = 'clearLocationServiceConfig';
extend(CLEAR_LOCATION_SERVICE_CONFIG, () => {
  executor(STORAGE_DATA, STORAGE_KEYS.LOCATION_SERVICE_CONFIG, '');
});
