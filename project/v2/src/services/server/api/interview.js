/**
 * 문진
 */
import BaseApiService from './core';

class InterviewApiService extends BaseApiService {
  constructor() {
    super('/api/interview');
  }

  /**
   * 문진 내역 조회
   */
  interviewList(loginId, requestDate) {
    return this.post('/interviewList', { loginId, requestDate });
  }

  /**
   * 문진 작성하기
   * @param {String} loginId
   * @param {String} interViewType
   * @param {String} interviewDate yyyyMMdd
   * @param {List} answerList
   * @param {String} answerList.answerNumber 문항 번호
   * @param {string} answerList.answerValue 답변
   */
  setInterview(loginId, interviewType, interviewDate, answerList) {
    return this.post('/setInterview', { loginId, interviewType, interviewDate, answerList });
  }
}

export default new InterviewApiService();
