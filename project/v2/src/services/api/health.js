/**
 * 건강상태
 */

import BaseApiService from './core';

class HealthApiService extends BaseApiService {
  constructor() {
    super('/api/results');
  }

  /**
   * 체온 상세
   */
  getBodyTemp(loginId, resultDate) {
    return this.post('/getBt', { loginId, resultDate });
  }

  /**
   * 혈압 상세
   */
  getBloodPresure(loginId, resultDate) {
    return this.post('/getBp', { loginId, resultDate });
  }
  /**
   * 심박수 상세
   */
  getHeartRate(loginId, resultDate) {
    return this.post('/getHr', { loginId, resultDate });
  }
  /**
   * 산소포화도 상세
   */
  getOxygenSaturation(loginId, resultDate) {
    return this.post('/getSpO2', { loginId, resultDate });
  }
  /**
   * 걸음수 상세
   */
  getStepCount(loginId, resultDate) {
    return this.post('/getStepCount', { loginId, resultDate });
  }
  /**
   * 호흡 상세
   */
  getRespiration(loginId, resultDate) {
    return this.post('/getRr', { loginId, resultDate });
  }
  /**
   * 수면 상세
   * @param {String} loginId
   * @param {String} resultStartDateTime yyyyMMddHH
   * @param {String} resultEndDateTime yyyyMMddHH
   */
  getSleepTime(loginId, resultStartDateTime, resultEndDateTime) {
    return this.post('/getSleepTime', { loginId, resultStartDateTime, resultEndDateTime });
  }

  /**
   * 체온 상태 저장
   * @param {String} loginId
   * @param {Array} btList
   * @param {String} btList.resultDate YYYYMMDD
   * @param {String} btList.resultTime HHmmss
   * @param {String} btList.deviceId
   */
  setBodyTemp(loginId, btList) {
    return this.post('/bt', { loginId, btList });
  }

  /**
   * 혈압 상태 저장
   * @param {String} loginId
   * @param {Array} bpList
   * @param {String} bpList.resultDate YYYYMMDD
   * @param {String} bpList.resultTime HHmmss
   * @param {String} bpList.dbp 최저 혈압
   * @param {String} bpList.sbp 최고 혈압
   * @param {String} bpList.deviceId
   */
  setBloodPresure(loginId, bpLIst) {
    return this.post('/getBp', { loginId, bpLIst });
  }

  /**
   * 심박수 상태 저장
   * @param {String} loginId
   * @param {Array} hrList
   * @param {String} hrList.resultDate YYYYMMDD
   * @param {String} hrList.resultTime HHmmss
   * @param {String} hrList.hr 심박수
   * @param {String} hrList.deviceId
   */
  setHeartRate(loginId, hrList) {
    return this.post('/hr', { loginId, hrList });
  }
  /**
   * 산소포화도 상태 저장
   * @param {String} loginId
   * @param {Array} spO2List
   * @param {String} spO2List.resultDate YYYYMMDD
   * @param {String} spO2List.resultTime HHmmss
   * @param {String} spO2List.spO2 산소포화도
   * @param {String} spO2List.deviceId
   */
  setOxygenSaturation(loginId, spO2List) {
    return this.post('/SpO2', { loginId, spO2List });
  }
  /**
   * 걸음수 상태 저장
   * @param {String} loginId
   * @param {Array} stepCountList
   * @param {String} stepCountList.resultDate YYYYMMDD
   * @param {String} stepCountList.resultTime HHmmss
   * @param {String} stepCountList.stepCount 걸음수
   * @param {String} stepCountList.deviceId
   */
  setStepCount(loginId, stepCountList) {
    return this.post('/StepCount', { loginId, stepCountList });
  }
  /**
   * 호흡 상태 저장
   * @param {String} loginId
   * @param {Array} rrList
   * @param {String} rrList.resultDate YYYYMMDD
   * @param {String} rrList.resultTime HHmmss
   * @param {String} rrList.rr 호흡수
   * @param {String} rrList.deviceId
   */
  setRespiration(loginId, rrList) {
    return this.post('/rr', { loginId, rrList });
  }
  /**
   * 수면 상태 저장
   * @param {String} loginId
   * @param {Array} sleepTimeList
   * @param {String} sleepTimeList.resultStartDate YYYYMMDD
   * @param {String} sleepTimeList.resultStartTime HHmmss
   * @param {String} sleepTimeList.resultEndDate YYYYMMDD
   * @param {String} sleepTimeList.resultEndTime HHmmss
   * @param {String} sleepTimeList.sleepType 수면 타입
   * @param {String} sleepTimeList.deviceId
   */
  setSleepTime(loginId, sleepTimeList) {
    return this.post('/SleepTime', { loginId, sleepTimeList });
  }

  /**
   * 측정 결과 전체 저장
   */
  setTotalResult(loginId, { btList = [], bpList = [], hrList = [], spO2List = [], stepCountList = [], rrList = [], sleppTimeList = [] }) {
    return this.post('/total', { loginId, btList, bpList, hrList, spO2List, stepCountList, rrList, sleppTimeList });
  }
}

export default new HealthApiService();
