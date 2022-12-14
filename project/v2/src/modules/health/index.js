// health(state) 관련 스토어
import dayjs from 'dayjs';
import _cloneDeep from 'lodash/cloneDeep';
import { ENUM_DATE_FORMAT } from '@/common/constants';
import { healthService } from '@/services/api';

import { LOGIN_ID } from '@/modules/patient';
const { Hms, SemiHm, YMD, Hm } = ENUM_DATE_FORMAT;

export const BLOOD_DETAIL = 'health/blood';
export const HEART_DETAIL = 'health/heart';
export const OXYGEN_DETAIL = 'health/oxygen';
export const STEP_DETAIL = 'health/step';
export const TEMPER_DETAIL = 'health/temper';
export const SLEEP_DETAIL = 'health/sleep';
export const RESPIRATION_DETAIL = 'health/respiration';

export default {
  state: {
    blood: [],
    heart: [],
    oxygen: [],
    step: [],
    temper: [],
    respiration: [],
    sleep: {
      totalSleepTime: '', // HHmm
      resultStartDateTime: '', //'YYYYMMDDHH'
      resultEndDateTime: '', //'YYYYMMDDHH'
      sleepTimeList: [],
    },
  },
  mutations: {
    [BLOOD_DETAIL](state, payload = []) {
      state.blood = payload;
    },
    [HEART_DETAIL](state, payload = []) {
      state.heart = payload;
    },
    [OXYGEN_DETAIL](state, payload = []) {
      state.oxygen = payload;
    },
    [STEP_DETAIL](state, payload = []) {
      state.step = payload;
    },
    [TEMPER_DETAIL](state, payload = []) {
      state.temper = payload;
    },
    [SLEEP_DETAIL](state, payload) {
      state.sleep = payload;
    },
    [RESPIRATION_DETAIL](state, payload = []) {
      state.respiration = payload;
    },
  },
  actions: {
    async [BLOOD_DETAIL]({ commit, getters }, { date }) {
      const loginId = getters[LOGIN_ID];
      const { code, message, data } = await healthService.getBloodPresure(loginId, date);
      commit(BLOOD_DETAIL, data.bpList);
      return { code, message, data };
    },
    async [HEART_DETAIL]({ commit, getters }, { date }) {
      const loginId = getters[LOGIN_ID];
      const { code, message, data } = await healthService.getHeartRate(loginId, date);
      commit(HEART_DETAIL, data.hrList);
      return { code, message, data };
    },
    async [OXYGEN_DETAIL]({ commit, getters }, { date }) {
      const loginId = getters[LOGIN_ID];
      const { code, message, data } = await healthService.getOxygenSaturation(loginId, date);
      commit(OXYGEN_DETAIL, data.spO2List);
      return { code, message, data };
    },
    async [STEP_DETAIL]({ commit, getters }, { date }) {
      const loginId = getters[LOGIN_ID];
      const { code, message, data } = await healthService.getStepCount(loginId, date);
      commit(STEP_DETAIL, data.stepCountList);
      return { code, message, data };
    },
    async [TEMPER_DETAIL]({ commit, getters }, { date }) {
      const loginId = getters[LOGIN_ID];
      const { code, message, data } = await healthService.getBodyTemp(loginId, date);
      commit(TEMPER_DETAIL, data.btList);
      return { code, message, data };
    },
    async [RESPIRATION_DETAIL]({ commit, getters }, { date }) {
      const loginId = getters[LOGIN_ID];
      const { code, message, data } = await healthService.getRespiration(loginId, date);
      commit(RESPIRATION_DETAIL, data.rrList);
      return { code, message, data };
    },
    async [SLEEP_DETAIL]({ commit, getters }, { date }) {
      const loginId = getters[LOGIN_ID];
      const yesterday = dayjs(date).subtract(1, 'day').format('YYYYMMDD');
      const { code, message, data } = await healthService.getSleepTime(loginId, `${yesterday}18`, `${date}18`);
      commit(SLEEP_DETAIL, data);
      return { code, message, data };
    },
  },
  getters: {
    [BLOOD_DETAIL]({ blood }) {
      const result = _cloneDeep(blood);
      return result.map((item) => {
        item.timeLabel = dayjs(item.resultTime, Hms).format(SemiHm);
        return item;
      });
    },
    [HEART_DETAIL]({ heart }) {
      const result = _cloneDeep(heart);
      return result.map((item) => {
        item.timeLabel = dayjs(item.resultTime, Hms).format(SemiHm);
        return item;
      });
    },
    [OXYGEN_DETAIL]({ oxygen }) {
      const result = _cloneDeep(oxygen);
      return result.map((item) => {
        item.timeLabel = dayjs(item.resultTime, Hms).format(SemiHm);
        return item;
      });
    },
    [STEP_DETAIL]({ step }) {
      const result = _cloneDeep(step);
      return result.map((item) => {
        item.timeLabel = dayjs(item.resultTime, Hms).format(SemiHm);
        return item;
      });
    },
    [TEMPER_DETAIL]({ temper }) {
      const result = _cloneDeep(temper);
      return result.map((item) => {
        item.timeLabel = dayjs(item.resultTime, Hms).format(SemiHm);
        return item;
      });
    },
    [RESPIRATION_DETAIL]({ respiration }) {
      const result = _cloneDeep(respiration);
      return result.map((item) => {
        item.timeLabel = dayjs(item.resultTime, Hms).format(SemiHm);
        return item;
      });
    },
    [SLEEP_DETAIL]({ sleep }) {
      const result = _cloneDeep(sleep);
      result.sleepTimeList = result.sleepTimeList.map((item) => {
        item.start = dayjs(`${item.sleepStartDate}${item.sleepStartTime}`, YMD + Hm);
        item.end = dayjs(`${item.sleepEndDate}${item.sleepEndTime}`, YMD + Hm);
        item.sleepMin = (item.end.toDate().getTime() - item.start.toDate().getTime()) / 1000 / 60;
        return item;
      });

      return result;
    },
  },
};
