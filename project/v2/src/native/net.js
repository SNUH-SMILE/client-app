import { RUNTIME, SERVER_NAME } from '@/common/config';
import { APP_ENV, OS_ENV } from '@/common/constants';
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
  if (RUNTIME.TYPE === APP_ENV.BROWSER) {
    // 브라우저인 경우
    return;
  }

  return new Promise((resolve, reject) => {
    if (RUNTIME.OS === OS_ENV.ANDROID) {
      // 안드로이드인 경우
    } else if (RUNTIME.OS === OS_ENV.IOS) {
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
