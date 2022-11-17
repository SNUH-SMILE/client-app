/**
 * Native Push 관련
 */
import { RUNTIME } from '@/common/config';
import { ENUM_APP_ENV, ENUM_OS_ENV } from '@/common/constants';
import { extend } from '.';

export const ON_LOCAL_PUSH = 'onLocalPush';
extend(ON_LOCAL_PUSH, () => {
  if (RUNTIME.TYPE === ENUM_APP_ENV.APP) {
    // TODO : push message API 작성
    M.execute('');
  }
});
