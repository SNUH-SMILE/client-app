import { BaseAlarmService } from './base';

class MedicineAlarmService extends BaseAlarmService {
  constructor() {
    super();
  }
  regist(row) {
    // 하나만 / 멀티
    // 고려해야할 점?
    return new Promise((resolve, reject) => {
      this.connect().then(() => {
        // query 짜야함
      });
    });
  }

  delete() {
    // 고려해야할 점?
  }
}

export default new MedicineAlarmService();
