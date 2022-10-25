import { factory } from '@/services/native/nativeFactory.js';
import { execute } from './';
const stepDetailResult = function stepDetailResult(result) {
  console.log(result);
};
const sleepDetailResult = function sleepDetailResult(result) {
  console.log(result);
};
const rateDetailResult = function rateDetailResult(result) {
  console.log(result);
};
const bloodDetailResult = function bloodDetailResult(result) {
  console.log(result);
};
const oxygenDetailResult = function oxygenDetailResult(result) {
  console.log(result);
};
const tempDetailResult = function tempDetailResult(result) {
  console.log(result);
};

/**
 * @describe 건강 상태 정보 조회
 * @param {String} date YYYYMMDD
 * @param {String} type {STEP(걸음정보),SLEEP(수면정보),RATE(심박정보),BLOOD(혈압정보),TEMP(체온정보),OXYGEN(혈중산소포화도 정보)}
 * @param {String} callbackFunc callback function
 */
const detailBodyDataFunction = function detailBodyData(date, type, callbackFunc) {
  var obj = {};
  obj.schDate = date; //'20220104';
  obj.queryDataType = type; //STEP(걸음정보),SLEEP(수면정보),RATE(심박정보),BLOOD(혈압정보),TEMP(체온정보),OXYGEN(혈중산소포화도 정보)
  obj.callback = callbackFunc;
  // if (type == 'STEP') {
  //   obj.callback = stepDetailResult;
  // } else if (type == 'SLEEP') {
  //   obj.callback = sleepDetailResult;
  // } else if (type == 'RATE') {
  //   obj.callback = rateDetailResult;
  // } else if (type == 'BLOOD') {
  //   obj.callback = bloodDetailResult;
  // } else if (type == 'TEMP') {
  //   obj.callback = tempDetailResult;
  // } else if (type == 'OXYGEN') {
  //   obj.callback = oxygenDetailResult;
  // }
  execute('exBodyDetailData', obj);
};
const exMainAllDataFunc = function exMainAllDataFunction(callback) {
  execute('exMainAllData', callback);
};

export const detailBodyData = factory({ android: detailBodyDataFunction });
export const exMainData = factory({ android: exMainAllDataFunc });
