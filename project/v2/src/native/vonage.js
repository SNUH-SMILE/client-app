/**
 * 비대면 화상 관련 (vonage)
 */

import { RUNTIME } from '@/common/config';
import { ENUM_APP_ENV, ENUM_OS_ENV } from '@/common/constants';
import Vue from 'vue';
import { extend } from '.';

export const OPEN_VONAGE_DOCTOR = 'openVonageDoctor';
extend(OPEN_VONAGE_DOCTOR, (apikey, sessionid, token) => {
  if (RUNTIME.TYPE === ENUM_APP_ENV.APP) {
    M.page.activity({
      className: 'VonageViewController',
      param: {
        apikey,
        sessionid,
        token,
      },
    });
  } else {
    Vue.$alert('지원하지 않는 플랫폼 입니다.');
  }
});
