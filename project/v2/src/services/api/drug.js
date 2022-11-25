/**
 * 복약관리
 */
import BaseApiService from './core';

class DrugApiService extends BaseApiService {
  constructor() {
    super('/api/drug');
  }

  /**
   * 복약 알림 리스트 조회
   */
  noticeList(loginId, requestDate) {
    return this.post('/noticeList', { loginId, requestDate });
  }

  /**
   * 복약 타임라인 조회
   */
  timeList(loginId, requestDate) {
    return this.post('/timeList', { loginId, requestDate });
  }

  /**
   * 복약 알림 저장
   * @param {Array} drugList 약 리스트 TODO: naming 바뀔 수 있음
   */
  setNotice(loginId, noticeStartDate, noticeEndDate, noticeDate, noticeName, drugList, noticeTimeList) {
    return this.post('/setNotice', { loginId, noticeStartDate, noticeEndDate, noticeDate, noticeName, drugList, noticeTimeList });
  }

  /**
   * 복약 결과 저장
   */
  setTakeResult(loginId, noticeId, resultDate, resultTime, takeResult) {
    this.post('/setTakeResult', { loginId, noticeId, resultDate, resultTime, takeResult });
  }

  /**
   * 알람없이 저장하기
   */
  setEtcResult(loginId, resultDate, resultTime, noticeName, drugCount, drugType) {
    this.post('/setEtcResult', { loginId, resultDate, resultTime, noticeName, drugCount, drugType });
  }
}

export default new DrugApiService();
