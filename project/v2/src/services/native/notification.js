import { factory } from '@/services/native/nativeFactory.js';
/**
 * 노티피케이션 관련
 * 알림 예약
 * 알림 띄우기
 */

/**
 * @describe 알림 띄우기
 * @param {object} options
 * @param {String} options.message
 * @param {String} options.path
 */
function notificationServiceFunction(options) {
  console.log(options.message);
  //TODO : 확장함수 나중에!
  M.execute('', options);
}

// 네이티브 노티를 띄울건지
// script 처리를 할 건지.
/**
 * @describe 푸시 서비스 가입
 * @return {boolean} 푸시 서비스 가입 성공 여부
 */
function registerPushServiceFunction() {
  M.plugin('push').remote.registerServiceAndUser({
    cuid: 'tester',
    name: 'testerName',
    callback: function (result) {
      var info = M.plugin('push').info();

      if (result.status == 'SUCCESS') {
        console.log('[' + info.CLIENT_UID + '/' + info.CLIENT_NAME + ']의 서비스/유저 등록을 성공 하였습니다.');
        return true;
      } else {
        console.log('[' + info.CLIENT_UID + '/' + info.CLIENT_NAME + ']의 서비스/유저 등록을 실패 하였습니다.');
        return false;
      }
    },
  });
}

/**
 * @describe 푸시 서비스 해제
 * @return {boolean} 푸시 서비스 해제 성공 여부
 */
function unregisterPushServiceFunction() {
  M.plugin('push').remote.unregisterService({
    callback: function (result, setting) {
      var info = M.plugin('push').info();
      if (result.status == 'SUCCESS') {
        console.log('[' + info.CLIENT_UID + '/' + info.CLIENT_NAME + ']의 서비스 해제가 성공 하였습니다.');
      } else {
        console.log('[' + info.CLIENT_UID + '/' + info.CLIENT_NAME + ']의 서비스 해제가 실패 하였습니다.');
      }
    },
  });
}

export const notification = factory({ android: notificationServiceFunction });
export const registerPushService = factory({ android: registerPushServiceFunction });
export const unregisterPushService = factory({ android: unregisterPushServiceFunction });
