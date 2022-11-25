/**
 * 메인
 */
import BaseApiService from './core';

class MainApiService extends BaseApiService {
  constructor() {
    super('/api');
  }

  /**
   * 메인화면 정보 조회
   */
  mainInfo(loginId) {
    return this.post('/main', { loginId });
  }

  /**
   * 신규 알림 여부 조회
   */
  mainNotice(loginId) {
    return this.post('/main/notice', { loginId });
  }

  /**
   * 격리상태 조회
   */
  getQuarantineStatus(loginId) {
    return this.post('/getQuarantineStatus', { loginId });
  }

  /**
   * 격리상태 저장
   */
  setQuarantineStatus(loginID, quarantineStatusDiv) {
    return this.post('/quarantineStatus', { loginID, quarantineStatusDiv });
  }
}

export default new MainApiService();
