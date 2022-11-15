/**
 * 운동하기
 */
import BaseApiService from './core';

class ExerciseApiService extends BaseApiService {
  constructor() {
    super('/api/health');
  }

  /**
   * 몸 상태 체크하기
   */
  getBodyStatus(loginId, requestDate) {
    return this.post('/getBodyStatus', { loginId, requestDate });
  }

  /**
   * 몸 상태 저장하기
   */
  setBodyStatus(loginId, resultDate, resultStatus) {
    return this.post('/setBodyStatus', { loginId, resultDate, resultStatus });
  }

  /**
   * 운동하기 알람 조회
   */
  getNoticeList(loginId, requestDate) {
    return this.post('/noticeList', { loginId, requestDate });
  }
  /**
   * 운동하기 알람 등록
   */
  setNotice(loginId, exerciseId, noticeTime) {
    // TODO : 운동 ID 키값 미정
    return this.post('/setNotice', { loginId, exerciseId, noticeTime });
  }
}

export default new ExerciseApiService();
