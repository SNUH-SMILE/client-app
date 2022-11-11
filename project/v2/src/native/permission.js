import { RUNTIME } from '@/common/config';
import { APP_ENV, OS_ENV } from '@/common/constants';
import { extend } from '.';

export const PERMISSION_LOCATION = 'permissionLocation';

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

const PERMISSION_MIKE = 'permissionMike';

extend(PERMISSION_MIKE, () => {
  if (RUNTIME.TYPE === APP_ENV.BROWSER) {
    // 브라우저인 경우
    return;
  }

  if (RUNTIME.OS === OS_ENV.ANDROID) {
    // 안드로이드인 경우
  } else if (RUNTIME.OS === OS_ENV.IOS) {
    // iOS인 경우
  }

  // TODO: 마이크 권한 API
});

const PERMISSION_BLUETOOTH = 'permissionBluetooth';

extend(PERMISSION_BLUETOOTH, () => {
  if (RUNTIME.TYPE === APP_ENV.BROWSER) {
    // 브라우저인 경우
    return;
  }

  if (RUNTIME.OS === OS_ENV.ANDROID) {
    // 안드로이드인 경우
  } else if (RUNTIME.OS === OS_ENV.IOS) {
    // iOS인 경우
  }

  // TODO: 블루투스 권한 API
});
