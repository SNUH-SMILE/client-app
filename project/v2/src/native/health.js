/**
 * 건강 관련 데이터 조회 API들
 */
import { RUNTIME } from '@/common/config';
import { APP_ENV } from '@/common/constants';
import Logger from '@/utils/logger';
import { extend } from '.';
const logger = new Logger('health');
const DATA_TYPE = ['STEP', 'SLEEP', 'RATE', 'BLOOD', 'TEMP', 'OXYGEN'];

/**
 * 건상 상세 정보 조회
 */
export const GET_BODY_DETAIL = 'getBodyDetail';
extend(GET_BODY_DETAIL, (schDate, queryDataType) => {
  return new Promise((resolve, reject) => {
    if (DATA_TYPE.includes(queryDataType)) {
      if (RUNTIME.TYPE === APP_ENV.BROWSER) {
        M.execute('exBodyDetailData', {
          schDate,
          queryDataType,
          callback: (...args) => {
            resolve(...args);
          },
        });
      }
    } else {
      logger.warn();
    }
  });
});

/**
 * 혈압 측정 시작
 */
export const ON_BLOOD_PRESURE = 'onBloodPresure';
extend(ON_BLOOD_PRESURE, () => {
  if (RUNTIME.TYPE === APP_ENV.APP) {
    M.execute('exBloodPresureTestStart');
  }
});

/**
 * 혈압 측정 중지
 */
export const OFF_BLOOD_PRESURE = 'offBloodPresure';
extend(OFF_BLOOD_PRESURE, () => {
  if (RUNTIME.TYPE === APP_ENV.APP) {
    M.execute('exBloodPresureTestStop');
  }
});

/**
 * 산소포화도 측정 시작
 */
export const ON_SPO2_PRESURE = 'onSPO2Presure';
extend(ON_SPO2_PRESURE, () => {
  if (RUNTIME.TYPE === APP_ENV.APP) {
    M.execute('exSpo2TestStart');
  }
});

/**
 * 산소포화도 측정 중지
 */
export const OFF_SPO2_PRESURE = 'offSPO2Presure';
extend(OFF_SPO2_PRESURE, () => {
  if (RUNTIME.TYPE === APP_ENV.APP) {
    M.execute('exSpo2TestStop');
  }
});

const CB_MAIN_ALL_RESULT = 'mainAllResult';
window[CB_MAIN_ALL_RESULT] = (...args) => {
  // TODO : 콜백 함수 작성
};

/**
 * 건강 상태 메인 조회
 */
export const GET_MAIN_BODY_DATA = 'getMainBodyData';
extend(GET_MAIN_BODY_DATA, () => {});
