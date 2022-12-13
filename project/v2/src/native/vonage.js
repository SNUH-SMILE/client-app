/**
 * 비대면 화상 관련 (vonage)
 */

import { RUNTIME } from '@/common/config';
import { ENUM_OS_ENV } from '@/common/constants';
import Vue from 'vue';
import { extend } from '.';

export const OPEN_VONAGE_DOCTOR = 'openVonageDoctor';
extend(OPEN_VONAGE_DOCTOR, (apiKey, sessionId, token) => {
  if (RUNTIME.OS === ENUM_OS_ENV.IOS) {
    M.page.activity({
      className: 'VonageViewController',
      param: {
        apiKey,
        sessionId,
        token,
      },
    });
  } else {
    Vue.$alert('지원하지 않는 OS 입니다.');
  }
});
