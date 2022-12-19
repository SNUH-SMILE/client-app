import { RUNTIME, SERVER_NAME } from '@/common/config';
import { ENUM_APP_ENV, ENUM_OS_ENV } from '@/common/constants';
import { STATUS } from './constants';
import { extend } from '.';

/**
 * XHR 통신 관련 API
 */

export const HTTP_SEND = 'httpSend';

extend(HTTP_SEND, (options) => {
  const _options = {
    server: options.server || SERVER_NAME,
    path: options.path,
    method: options.method || 'POST',
    timeout: options.timeout || 30000,
    userData: options.userData || {},
    indicator: { show: false },
    data: options.data,
  };
  if (RUNTIME.TYPE === ENUM_APP_ENV.BROWSER) {
    // 브라우저인 경우
    return;
  }

  return new Promise((resolve, reject) => {
    if (RUNTIME.OS === ENUM_OS_ENV.ANDROID) {
      // 안드로이드인 경우
    } else if (RUNTIME.OS === ENUM_OS_ENV.IOS) {
      // iOS인 경우
    }

    M.net.http.send({
      ..._options,
      success(...args) {
        resolve(...args);
      },
      error(...args) {
        reject(...args);
      },
    });
  });
});

export const ENUM_RESOURCE_UPDATE_ACTION = {
  PASS: 'pass',
  REFRESH: 'refresh',
  RETRY: 'retry',
  UPDATE: 'update', // 업데이트가 필요한 케이스
};
export const APP_RESOURCE_UPDATE = 'appResourceUpdate';
extend(APP_RESOURCE_UPDATE, () => {
  if (RUNTIME.TYPE === ENUM_APP_ENV.BROWSER) {
    // App 이 아닌 경우
    return Promise.resolve({
      status: STATUS.SUCC,
      message: '',
      action: ENUM_RESOURCE_UPDATE_ACTION.PASS,
      payload: {},
    });
  }
  return new Promise((resolve, reject) => {
    M.net.res.check({
      callback: function (status, result) {
        if (status !== 'IS_RESOURCE_UPDATE') {
          if (result.errorCode !== '905') {
            return resolve({
              status: STATUS.FAIL,
              message: '리소스 업데이트 실패',
              action: ENUM_RESOURCE_UPDATE_ACTION.RETRY,
              payload: {},
            });
          }
        }
        if (result.update) {
          // 업데이트 가능한 경우
          M.net.res.update({
            finish: function (status, info, option) {
              switch (status) {
                // 리소스 업데이트 성공
                // 리소스 업데이트 성공 And Refresh
                case 'SUCCESS':
                case 'SUCCESS_AND_REFRESH':
                  resolve({
                    status: STATUS.SUCC,
                    message: '',
                    action: ENUM_RESOURCE_UPDATE_ACTION.REFRESH,
                    payload: {},
                  });
                  break;
                // 앱 권장 업데이트
                // 앱 강제 업데이트
                case 'RECOMMENDED_APP_UPDATING':
                case 'FORCED_APP_UPDATING':
                  resolve({
                    status: STATUS.FAIL,
                    message: '앱을 업데이트해야 합니다.',
                    action: ENUM_RESOURCE_UPDATE_ACTION.UPDATE,
                    payload: {
                      url: info.app_version_info.download_market_url,
                      info,
                    },
                  });
                  break;
                // 라이센스 체크 에러
                // 라이센스 무결성 회손
                // 라이센스 기간 만료
                case 'LICENSE_IS_NOT_EXISTENCE':
                case 'BROKEN_INTEGRITY_OF_LICENSE':
                case 'EXPIRED_LICENSE':
                  resolve({
                    status: STATUS.FAIL,
                    message: '라이센스 에러입니다.',
                    action: ENUM_RESOURCE_UPDATE_ACTION.RETRY,
                    payload: {},
                  });
                  break;
                // 설치 메모리 부족
                case 'INSUFFICIENT_MEMORY':
                  resolve({
                    status: STATUS.FAIL,
                    message: '설치 메모리가 부족합니다.',
                    action: ENUM_RESOURCE_UPDATE_ACTION.RETRY,
                    payload: {},
                  });
                  break;
                // 외장 메모리 카드 사용 오류
                case 'EXT_MEM_NOT_AVAIL':
                  resolve({
                    status: STATUS.FAIL,
                    message: '외장 메모리 오류입니다.',
                    action: ENUM_RESOURCE_UPDATE_ACTION.RETRY,
                    payload: {},
                  });
                  break;
                default:
                  resolve({
                    status: STATUS.FAIL,
                    message: '알 수 없는 오류입니다.',
                    action: ENUM_RESOURCE_UPDATE_ACTION.RETRY,
                    payload: {},
                  });
              }
            },

            progress: function (total, read, remain, percentage, option) {},
            error: function (errCode, errMsg, option) {
              resolve({
                status: STATUS.FAIL,
                message: '알 수 없는 오류입니다.',
                action: ENUM_RESOURCE_UPDATE_ACTION.RETRY,
                payload: {},
              });
            },
          });
        } else {
          resolve({
            status: STATUS.SUCC,
            message: '',
            action: ENUM_RESOURCE_UPDATE_ACTION.PASS,
            payload: {},
          });
        }
      },
    });
  });
});
