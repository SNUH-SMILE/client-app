import BaseApiService from './core';

class PatientService extends BaseApiService {
  constructor() {
    super('/api/patient');
  }

  /**
   * @describe 로그인
   */
  login(loginId, password) {
    return this.post('/login', { loginId, password });
  }

  /**
   * @describe 아이디 찾기
   */
  findId(patientNm, cellPhone, birthDate, sex) {
    return this.post('/findById', { patientNm, cellPhone, birthDate, sex });
  }

  /**
   * @describe 비밀번호 찾기
   */
  findPassword(loginId, patientNm, cellPhone) {
    return this.post('/findPassword', { loginId, patientNm, cellPhone });
  }

  password(loginId, password) {
    return this.post('/password', { loginId, password });
  }

  identity(patientNm, birthDate, sex, cellPhone) {
    return this.post('/identity', { patientNm, birthDate, sex, cellPhone });
  }

  duplicate(loginId) {
    return this.post('/duplicate', { loginId });
  }

  join(loginId, password, patientNm, birthDate, sex, cellPhone, guardianCellPhone, zipCode, address1, address2) {
    return this.post('/join', { loginId, password, patientNm, birthDate, sex, cellPhone, guardianCellPhone, zipCode, address1, address2 });
  }

  ////////////////////////////////////////////

  setPatient(loginId, cellPhone, guardianCellPhone, zipCode, address1, address2) {
    return this.post('/setPatient', { loginId, cellPhone, guardianCellPhone, zipCode, address1, address2 });
  }

  patient(loginId) {
    return this.post('/patient', { loginId });
  }

  device(loginId, devices) {
    return this.post('/device', { loginId, devices });
  }
}

export default new PatientService();
