/**
 * Native Push 관련
 */
import { RUNTIME } from '@/common/config';
import { ENUM_ALARM_TYPE, ENUM_APP_ENV, ENUM_DATE_FORMAT, ENUM_OS_ENV } from '@/common/constants';
import router from '@/router';
import dayjs from 'dayjs';
import Vue from 'vue';
import { bindGlobalCb, executor, extend } from '.';
import { STATUS } from './constants';
import { OPEN_VONAGE_DOCTOR } from './vonage';

const IOS_NOTIFICATION_CB_NAME = 'oniOSReceiveNotification';
const ANDROID_NOTIFICATION_CB_NAME = 'onReceiveNotification';

export const notificaitonCommonEvent = (payload) => {
  Vue.$alert(`PUSH PAYLOD JSON <br/> ${JSON.stringify(payload)}`);
  let ext;
  try {
    ext = JSON.parse(payload.payload.mps.ext);
  } catch (error) {
    ext = JSON.parse(payload.mps.ext);
  }

  // TODO: 푸시(알람) 케이스 별 처리 필요
  if (ext.action === ENUM_ALARM_TYPE.EXERCISE) {
    router.push({ name: 'exercise-id', params: { id: ext.videoId } });
  } else if (ext.action === ENUM_ALARM_TYPE.MEDICINE) {
    router.push({
      name: 'medicine-check',
      query: { requestDate: dayjs().format(ENUM_DATE_FORMAT.YMD) },
    });
  } else if (ext.action === ENUM_ALARM_TYPE.DOCTOR) {
    const { apiKey, sessionId, token } = ext.infomation;
    executor(OPEN_VONAGE_DOCTOR, apiKey, sessionId, token);
  }
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
