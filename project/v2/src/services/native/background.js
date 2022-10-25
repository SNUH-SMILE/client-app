import { factory } from '@/services/native/nativeFactory.js';

/**
 * @describe 백그라운드 서비스 시작
 */
function startBL() {
  M.execute('exLocationStart', 'user_id_1', 'http://192.168.100.209:8080/location');
}

/**
 * @describe 백그라운드 서비스 중지
 */
function stopBL() {
  M.execute('exLocationStop');
}

/**
 * @describe 백그라운드 서비스 상태
 */
function stateBL() {
  var state = M.execute('exLocationState');
}

export const startBackground = factory({ android: startBL });
export const stopBackground = factory({ android: stopBL });
export const stateBackground = factory({ android: stateBL });
