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
}
