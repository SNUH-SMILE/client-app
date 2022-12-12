import { ENUM_BODY_STATUS, STORAGE_KEYS } from '@/common/constants';
import { executor } from '@/native';
import { STORAGE_DATA } from '@/native/data';
import exerciseService from './service';

export const EXERCISE_LIST = 'exercise/list';
export const EXERCISE_DETAIL = 'exercise/detail';
export const EXERCISE_BODY_STATUS = 'exercise/bodyStatus';
export const EXERCISE_ALARMS = 'exercise/alarms';

export default {
  state: {
    exerciseList: [],
    exerciseDetail: {},
    exerciseAlarms: [],
    bodyStatus: executor(STORAGE_DATA, STORAGE_KEYS.BODY_CHECK) || ENUM_BODY_STATUS.NONE,
  },
  mutations: {
    [EXERCISE_DETAIL](state, payload) {
      state.exerciseDetail = exerciseService.getExerciseVideoDetail(payload);
    },
    [EXERCISE_LIST](state) {
      state.exerciseList = exerciseService.getExerciseVideoList(state.bodyStatus);
    },
    [EXERCISE_BODY_STATUS](state, payload) {
      state.bodyStatus = payload;
      executor(STORAGE_DATA, STORAGE_KEYS.BODY_CHECK, payload);
    },
    [EXERCISE_ALARMS](state, payload = []) {
      state.exerciseAlarms = payload;
    },
  },
  actions: {
    async [EXERCISE_ALARMS]({ commit }) {
      const list = await exerciseService.getExerciseAlarams();
      commit(EXERCISE_ALARMS, list);
    },
  },
  getters: {
    [EXERCISE_DETAIL]({ exerciseDetail }) {
      return exerciseDetail;
    },
    [EXERCISE_LIST]({ exerciseList }) {
      return exerciseList.map((item) => item);
    },
    [EXERCISE_BODY_STATUS]({ bodyStatus }) {
      return bodyStatus;
    },
    [EXERCISE_ALARMS]({ exerciseAlarms }) {
      return exerciseAlarms;
    },
  },
};
