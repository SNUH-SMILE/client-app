import { factory } from '@/services/native/nativeFactory.js';
/**
 * @describe 모피어스 http 통신
 * @param {Object} options
 * @param {string} options.path 서버 이름
 * @param {string} options.path 요청 URL
 * @param {string} options.method method (GET, PUT, POST, DELETE)
 * @param {int} options.timeout timeout in milliseconds
 * @param {object} options.userData
 * @param {Object} options.indicator 인디케이터 정보
 * @param {Function} options.success 성공시 콜백
 * @param {function} options.error 실패시 콜백
 */
function MApiHttpSendFunc(options) {
  if (options.path === undefined || options.path === '') {
    return new Error('path 설정은 필수 입니다.');
  }
  if (typeof options.success !== 'function') {
    return new Error('success 는 function 형태이어야 합니다.');
  }
  if (typeof options.error !== 'function') {
    return new Error('error 는 function 형태이어야 합니다.');
  }

  const _options = {
    server: options.server || '',
    path: options.path,
    method: options.method || 'POST',
    timeout: options.timeout || 30000,
    userData: options.userData || {},
    indicator: options.indicator || {
      show: true,
      message: 'Loading..',
      cancelable: true,
    },
    data: options.data,
    success: options.success,
    error: options.error,
  };

  M.net.http.send(_options);
}

export const sendHttp = factory({ android: MApiHttpSendFunc });
