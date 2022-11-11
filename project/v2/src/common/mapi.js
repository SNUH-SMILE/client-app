import { factory } from '@/services/native/nativeFactory.js';
import { SERVER_NAME } from '@/common/constants.js';
import VueLogger from '@/common/logger';
import Vue from 'vue';
const logger = new VueLogger('HTTP');
/**
 * @describe 모피어스 http 통신
 * @param {Object} options
 * @param {string} options.path 서버 이름
 * @param {string} options.path 요청 URL
 * @param {string} options.method method (GET, PUT, POST, DELETE)
 * @param {int} options.timeout timeout in milliseconds
 */
function MApiHttpSendFunc(options) {
  const loading = Vue.$loading();
  return new Promise((resolve, reject) => {
    const DEFAULT_ERROR_FUNC = function (...args) {
      loading.$hide();
      logger.info('fail', args);
      reject(args);
    };
    const DEFAULT_SUCCESS_FUNC = function (args) {
      loading.$hide();
      logger.log('success', args);
      resolve(args);
    };
    const _options = {
      server: options.server || SERVER_NAME,
      path: options.path,
      method: options.method || 'POST',
      timeout: options.timeout || 30000,
      userData: options.userData || {},
      indicator: { show: false },
      data: options.data,
      success: DEFAULT_SUCCESS_FUNC,
      error: DEFAULT_ERROR_FUNC,
    };
    M.net.http.send(_options);
  });
}

export const sendHttp = factory({ android: MApiHttpSendFunc });
