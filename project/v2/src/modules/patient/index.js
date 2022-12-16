// patient 환자 관련 스토어

import _cloneDeep from 'lodash/cloneDeep';
import { RESPONSE_STATUS, STORAGE_KEYS } from '@/common/constants';
import { executor } from '@/native';
import { STORAGE_DATA } from '@/native/data';
import { patientService } from '@/services/api';
import { REGIST_PUSH_SERVICE } from '@/native/push';
import { CLEAR_LOCATION_SERVICE_CONFIG } from '@/native/fgService';

export const SET_AUTH = 'patient/setAuth';
export const LOGIN = 'patient/login';
export const LOGOUT = 'patient/logout';
export const IS_ANONYMOUS = 'patient/isAnonymous';
export const ACCESS_TOKEN = 'patient/accessToken';
export const SESSION = 'patient/session';
export const LOGIN_ID = 'patient/loginId';
export const DEVICE_INFO = 'patient/device';
export const IS_GARMIN_DEVICE = 'patient/isGarmin';

const INIT_SESSION_DATA = () => ({
  patientNm: '', // 홍길동
  birthDate: '', // YYYYMMDD
  sex: 'M', // M,F
  cellPhone: '', // 01012345678
  guardianCellPhone: '', // 01043214321
  zipCode: '', // 123456
  address1: '', // 서울시 봉은사로 108길 33
  address2: '', // 유라클
});

const INIT_DEVICE_DATA = () => ({
  deviceId: '',
  deviceName: '',
});

export default {
  state: {
    token: executor(STORAGE_DATA, STORAGE_KEYS.TOKEN),
    loginId: executor(STORAGE_DATA, STORAGE_KEYS.LOGIN_ID),
    device: INIT_DEVICE_DATA(),
    session: INIT_SESSION_DATA(),
  },
  mutations: {
    [SET_AUTH](state, { token, loginId }) {
      state.token = token;
      state.loginId = loginId;
      executor(STORAGE_DATA, STORAGE_KEYS.TOKEN, token);
      executor(STORAGE_DATA, STORAGE_KEYS.LOGIN_ID, loginId);
    },
    [LOGOUT](state) {
      state.token = '';
      executor(STORAGE_DATA, STORAGE_KEYS.TOKEN, '');
      executor(STORAGE_DATA, STORAGE_KEYS.LOGIN_ID, '');
      executor(STORAGE_DATA, STORAGE_KEYS.SAVE_LOGIN_INPUT, '');
      executor(CLEAR_LOCATION_SERVICE_CONFIG);
    },
    [SESSION](state, payload) {
      state.session = payload;
    },
    [DEVICE_INFO](state, payload) {
      state.device = payload;
    },
  },
  actions: {
    async [LOGIN]({ commit }, { loginId, password }) {
      const rs = await patientService.login(loginId, password);
      const { token } = rs.data;
      if (rs.code === RESPONSE_STATUS.SUCCESS) {
        commit(SET_AUTH, { token, loginId });
        executor(REGIST_PUSH_SERVICE, loginId);
        executor(STORAGE_DATA, STORAGE_KEYS.SAVE_LOGIN_INPUT, { loginId, password });
      }

      return rs;
    },
    async [SESSION]({ commit, state: { loginId } }) {
      const { code, message, data } = await patientService.patient(loginId);
      if (code === RESPONSE_STATUS.SUCCESS) {
        commit(SESSION, data);
      }
      return { code, message, data };
    },
    async [DEVICE_INFO]({ commit, state: { loginId } }) {
      const { code, message, data } = await patientService.getDevice(loginId);
      if (code === RESPONSE_STATUS.SUCCESS && data.result[0]) {
        commit(DEVICE_INFO, data.result[0]);
      }
      return { code, message, data };
    },
  },
  getters: {
    [IS_ANONYMOUS]({ token }) {
      return !token;
    },
    [ACCESS_TOKEN]({ token }) {
      return token;
    },
    [SESSION]({ session }) {
      const info = _cloneDeep(session);
      return info;
    },
    [LOGIN_ID]({ loginId }) {
      return loginId;
    },
    [DEVICE_INFO]({ device }) {
      return device;
    },
    [IS_GARMIN_DEVICE]({ device, loginId }) {
      return device.deviceId === loginId;
    },
  },
};
