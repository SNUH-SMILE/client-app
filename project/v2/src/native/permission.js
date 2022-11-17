import { RUNTIME } from '@/common/config';
import { ENUM_APP_ENV, ENUM_OS_ENV } from '@/common/constants';
import { extend } from '.';

/**
 * 위치 권한
 */
export const PERMISSION_LOCATION = 'permissionLocation';
extend(PERMISSION_LOCATION, () => {
  if (RUNTIME.TYPE === ENUM_APP_ENV.BROWSER) {
    // 브라우저인 경우
    return;
  }

  if (RUNTIME.OS === ENUM_OS_ENV.ANDROID) {
    // 안드로이드인 경우
  } else if (RUNTIME.OS === ENUM_OS_ENV.IOS) {
    // iOS인 경우
  }

  // TODO: 위치 권한 API
});

/**
 * 마이크 권한
 */
export const PERMISSION_MIKE = 'permissionMike';
extend(PERMISSION_MIKE, () => {
  if (RUNTIME.TYPE === ENUM_APP_ENV.BROWSER) {
    // 브라우저인 경우
    return;
  }

  if (RUNTIME.OS === ENUM_OS_ENV.ANDROID) {
    // 안드로이드인 경우
  } else if (RUNTIME.OS === ENUM_OS_ENV.IOS) {
    // iOS인 경우
  }

  // TODO: 마이크 권한 API
});

/**
 * 블루투스 권한
 */
export const PERMISSION_BLUETOOTH = 'permissionBluetooth';
extend(PERMISSION_BLUETOOTH, () => {
  if (RUNTIME.TYPE === ENUM_APP_ENV.BROWSER) {
    // 브라우저인 경우
    return;
  }

  if (RUNTIME.OS === ENUM_OS_ENV.ANDROID) {
    // 안드로이드인 경우
  } else if (RUNTIME.OS === ENUM_OS_ENV.IOS) {
    // iOS인 경우
  }

  // TODO: 블루투스 권한 API
});

/**
 * 저장소 권한
 */
export const PERMISSION_DRIVE = 'permissionDrive';
extend(PERMISSION_BLUETOOTH, () => {
  if (RUNTIME.PERMISSION_DRIVE === ENUM_APP_ENV.BROWSER) {
    // 브라우저인 경우
    return;
  }

  if (RUNTIME.OS === ENUM_OS_ENV.ANDROID) {
    // 안드로이드인 경우
  } else if (RUNTIME.OS === ENUM_OS_ENV.IOS) {
    // iOS인 경우
  }

  // TODO: 저장소 권한 API
});
