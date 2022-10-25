import { factory } from '@/services/native/nativeFactory.js';

function getcurrentLocation() {
  console.log('위치 권한');
  // M.execute('');
  return true;
}

function getmikePermission() {
  console.log('마이크 권한');
  M.execute('');
  return true;
}
function getbluetoothPermission() {
  console.log('블루투스 권한');
  M.execute('');
  return true;
}

export const getCurrendLocation = factory({ android: getcurrentLocation });
export const getMikePermission = factory({ android: getmikePermission });
export const getBluetoothPermission = factory({ android: getbluetoothPermission });
