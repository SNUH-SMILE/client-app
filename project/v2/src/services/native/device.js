import { factory } from '@/services/native/nativeFactory.js';
import { execute, asyncExecute } from './';

/**
 * 밴드 리스트 조회
 * @param {Func} callback 콜백 함수
 */
function bandScanFunc(callback) {
  var obj = {};
  obj.schBluetooth = 'C';
  // M.execute('exBandScan', obj, callback);
  execute('exBandScan', obj, callback);
}

function bandDisconnectFunc() {
  // 디바이스 연결 끊기, 콜백 함수는 연결시 보냄.
  M.execute('exBandDisconnect');
}
function bandScanStopFunc() {
  // 디바이스 스캔 중지, 콜백은 스캔 함수 콜백으로 옴. 0104 코드로
  M.execute('exBandScanStop');
}
function lastDeviceIdCallback(result) {
  // 제일 마직막 연결된 디바이스 ID 를 조회하기 위한 콜백 함수
  // 해당 값은 가져온후에, 따로 js 변수에 저장, 새로운 디바이스 연동시 js 변수 값 변경
  console.log(result);
}
function lastDeviceIdFunc() {
  // 제일 마지막에 연결된 디바이스 ID 를 가져온다.
  // 자동연결이 필요한 경우에 필요
  //     스캔 시작후, 해당 ID 가 스캔되면, 자동 연결
  M.execute('`exLastDeviceId`', lastDeviceIdCallback);
}

/**
 * @describe 밴드 연결
 * @param {string} addr 밴드 addr
 * @param {function} callback 콜백함수
 */
function bandConnectFunc(addr, callback) {
  var obj = {};
  obj.schBluetooth = 'C';
  obj.bandAddr = addr;
  //로그인 에서 왔을 때는 디바이스, 디비를 초기화 하고, 설정 메뉴를 통해서 들어왔을 때는 초기화 없이 사용한다.
  obj.resetType = '0'; // resetType - 0 : 디바이스/디비 초기화 , 1 : 디바이스 초기화 , 2 : 초기화 없음
  obj.callback = callback;
  execute('exBandConnect', obj);
}

// 밴드 연결 여부
function isBandConnectedFunc() {
  return new Promise(function (resolve) {
    // T == 연결됨, F == 연결안됨.
    resolve(M.execute('exIsBandConnect') == 'T');
  });
}

export const bandScan = factory({ android: bandScanFunc });
export const bandDisconnect = factory({ android: bandDisconnectFunc });
export const bandScanStop = factory({ android: bandScanStopFunc });
export const lastDeviceId = factory({ android: lastDeviceIdFunc });
export const isBandConnected = factory({ android: isBandConnectedFunc });
export const bandConnect = factory({ android: bandConnectFunc });
