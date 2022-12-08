/**
 * Native Push 관련
 */
import { RUNTIME } from '@/common/config';
import { ENUM_APP_ENV, ENUM_OS_ENV } from '@/common/constants';
import Vue from 'vue';
import { bindGlobalCb, extend } from '.';
import { STATUS } from './constants';

const IOS_NOTIFICATION_CB_NAME = 'oniOSReceiveNotification';
const ANDROID_NOTIFICATION_CB_NAME = 'onReceiveNotification';

export const notificaitonCommonEvent = (payload) => {
  Vue.$alert(`PUSH PAYLOD JSON <br/> ${JSON.stringify(payload)}`);
};

bindGlobalCb(IOS_NOTIFICATION_CB_NAME, (payload) => {
  notificaitonCommonEvent(payload);
});

bindGlobalCb(ANDROID_NOTIFICATION_CB_NAME, (notificaiton) => {
  try {
    notificaitonCommonEvent(JSON.parse(notificaiton.payload));
  } catch (e) {
    console.error(e);
    Vue.$alert(`올바르지 않은 푸시 규격입니다. <br/> ${JSON.stringify(notificaiton)}`);
  }
});

export const ON_LOCAL_PUSH = 'onLocalPush';
extend(ON_LOCAL_PUSH, () => {
  if (RUNTIME.TYPE === ENUM_APP_ENV.APP) {
    // TODO : push message API 작성
    M.execute('');
  }
});

export const REGIST_PUSH_SERVICE = 'registPushService';
extend(REGIST_PUSH_SERVICE, (cuid) => {
  if (RUNTIME.TYPE !== ENUM_APP_ENV.APP) {
    return Promise.reject();
  }

  return new Promise((resolve, reject) => {
    M.plugin('push').remote.registerServiceAndUser({
      cuid,
      name: cuid,
      callback: function ({ status }) {
        if (status === STATUS.SUCC) {
          resolve();
        } else {
          reject();
        }
      },
    });
  });
});

export const UNREGIST_PUSH_SERVICE = 'unRegistPushService';
extend(UNREGIST_PUSH_SERVICE, () => {
  if (RUNTIME.TYPE !== ENUM_APP_ENV.APP) {
    return Promise.reject();
  }

  return new Promise((resolve, reject) => {
    M.plugin('push').remote.unregisterService({
      callback: function ({ status }) {
        if (status === STATUS.SUCC) {
          resolve();
        } else {
          reject();
        }
      },
    });
  });
});

export const STARTED_PUSH_CHECK = 'startedPushCheck';
extend(STARTED_PUSH_CHECK, () => {
  const data = M.data.global();
  const pushData = data['_PUSHDATA'];
  M.data.removeGlobal('_PUSHDATA');
  return pushData;
});
