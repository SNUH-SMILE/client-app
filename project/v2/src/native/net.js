import { RUNTIME } from '@/common/config';
import { APP_ENV, OS_ENV } from '@/common/constants';
import { extend } from '.';

/**
 * XHR 통신 관련 API
 */

const PERMISSION_LOCATION = 'permissionLocation';

extend(PERMISSION_LOCATION, () => {
  if (RUNTIME.TYPE === APP_ENV.BROWSER) {
    // 브라우저인 경우
    return;
  }

  if (RUNTIME.OS === OS_ENV.ANDROID) {
    // 안드로이드인 경우
  } else if (RUNTIME.OS === OS_ENV.IOS) {
    // iOS인 경우
  }

  // TODO: 위치 권한 API
});
