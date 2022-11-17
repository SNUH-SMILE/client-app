// patient 환자 관련 스토어

import { RESPONSE_STATUS, STORAGE_KEYS } from '@/common/constants';
import { executor } from '@/native';
import { STORAGE_DATA } from '@/native/data';
import { patientService } from '@/services/server/api';

export const SET_TOKEN = 'patient/setToken';
export const LOGIN = 'patient/login';
export const LOGOUT = 'patient/logout';
export const IS_ANONYMOUS = 'patient/isAnonymous';
export const ACCESS_TOKEN = 'patient/accessToken';
export default {
  state: {
    token: '',
  },
  mutations: {
    [SET_TOKEN](state, payload) {
      state.token = payload;
      executor(STORAGE_DATA, STORAGE_KEYS.TOKEN, payload);
    },
    [LOGOUT](state) {
      state.token = '';
      executor(STORAGE_DATA, STORAGE_KEYS.TOKEN, '');
    },
  },
  actions: {
    async [LOGIN]({ commit }, { loginId, password }) {
      const result = await patientService.login(loginId, password);
      if (result.code === RESPONSE_STATUS.SUCCESS) commit(SET_TOKEN, result.token);
      return result;
    },
  },
  getters: {
    [IS_ANONYMOUS]({ token }) {
      return !token;
    },
    [ACCESS_TOKEN](token) {
      return token;
    },
  },
};
