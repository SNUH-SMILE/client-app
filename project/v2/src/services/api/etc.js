import BaseApiService from './core';

class EtcApiService extends BaseApiService {
  constructor() {
    super('/api');
  }

  /**
   * 공지사항 목록 조회
   */
  supportNoticeList(loginId) {
    return this.post('/support/noticeList', { loginId });
  }
  /**
   * 문의 내역 조회
   */
  supportQuestionList(loginId) {
    return this.post('/support/questionList', { loginId });
  }

  /**
   * 문의 등록
   */
  supportSetQuestion(loginId, questionTitle, questionBody) {
    return this.post('/support/setQuestion', { loginId, questionTitle, questionBody });
  }

  /**
   * 알림 목록 조회
   */
  patientNoticeList(loginId) {
    return this.post('/patientDashboard/detail/noticeAppList', { loginId });
  }

  /**
   * 가민 등록
   */
  garminRegistGarmin(loginId, garminId, garminPassword) {
    return this.post('/garmin/registGarmin', { loginId, garminId, garminPassword });
  }

  /**
   * 가민 상태 조회
   */
  garminGarminStatus(loginId) {
    return this.post('/garmin/garminStatus', { loginId });
  }

  /**
   * 가민 등록 해제
   */
  garminUnRegistGarmin(loginId) {
    return this.post('/garmin/unRegistGarmin', { loginId });
  }

  /**
   * 가민 업데이트
   */
  garminUpdateGarmin(loginId, garminId, garminPassword) {
    return this.post('/garmin/updateGarmin', { loginId, garminId, garminPassword });
  }
}

export default new EtcApiService();
