/**
 * 복약관리
 */
import BaseApiService from './core';

class DrugApiService extends BaseApiService {
  constructor() {
    super('/api/drug');
  }
  /**
   *
   * @param {*} loginId
   * @param {*} noticeStartDate YYYYMMDD
   * @param {*} noticeEndDate YYYYMMDD
   * @param {*} noticeDate
   * @param {*} noticeName
   * @param {*} drugList
   * @param {*} noticeTimeList
   */
  setNotice(loginId, noticeStartDate, noticeEndDate, noticeDate, noticeName, drugList, noticeTimeList) {
    return this.post('/setNotice', { loginId, noticeStartDate, noticeEndDate, noticeDate, noticeName, drugList, noticeTimeList });
  }
  /**
   *
   * @param {*} loginId
   * @param {string} requestDate YYYYMMDD
   */
  noticeList(loginId, requestDate) {
    return this.post('/noticeList', { loginId, requestDate });
  }
  /**
   *
   * @param {*} loginId
   * @param {*} drugAlarmSeq
   * @param {*} resultDate YYYYMMDD
   * @param {*} resultTime HHmm
   * @param {*} takeResult
   * 0: 복용 여부 없음
   * 1: 복용함
   * 2: 복용 안함
   */
  setTakeResult(loginId, drugAlarmSeq, resultDate, resultTime, takeResult) {
    return this.post('/setTakeResult', { loginId, drugAlarmSeq, resultDate, resultTime, takeResult });
  }

  /**
   *
   * @param {string} loginId
   * @param {*} resultDate YYYYMMDD
   * @param {*} resultTime HHmm
   * @param {*} drugName
   * @param {*} drugCount
   * @param {*} drugType
   */
  setEtcResult(loginId, resultDate, resultTime, drugName, drugCount, drugType) {
    return this.post('/setEtcResult', { loginId, resultDate, resultTime, drugName, drugCount, drugType });
  }

  timeList(loginId, requestDate) {
    return this.post('/timeList', { loginId, requestDate });
  }
}

export default new DrugApiService();
