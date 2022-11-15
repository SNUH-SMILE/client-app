/**
 * 비대면 진료
 */
import BaseApiService from './core';

class DianosisApiService extends BaseApiService {
  constructor() {
    super('/api/dianosis');
  }

  /**
   * 진료 내역 조회
   */
  getList(loginId, requestDate) {
    return this.post('/getList', { loginId, requestDate });
  }
}

export default new DianosisApiService();
