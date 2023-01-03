import _find from 'lodash/find';
import _forEach from 'lodash/forEach';
import { ENUM_BODY_STATUS, ENUM_DATE_FORMAT, STORAGE_KEYS } from '@/common/constants';
import { executor } from '@/native';
import { STORAGE_DATA } from '@/native/data';
import { TYPE_AM, TYPE_CONFIRMED_DAY, TYPE_ISOLATION_DAY, TYPE_ISOLATION_DAY_AFTER_30 } from '@/modules/history';
import exerciseService from './service';
import dayjs from 'dayjs';

export const EXERCISE_LIST = 'exercise/list';
export const EXERCISE_DETAIL = 'exercise/detail';
export const EXERCISE_BODY_STATUS = 'exercise/bodyStatus';
export const EXERCISE_ALARMS = 'exercise/alarms';
export const EXERCISE_REGIST_STATUS = 'exercise/registStatus';
export const LAST_INTERVIEW_DATE = 'exercise/lastInterviewDate';

const EXERCISE_BODY_VALIDATE_CONFIG = [
  {
    type: TYPE_CONFIRMED_DAY,
    validate: [
      { key: '10', value: '8' },
      { key: '12', value: '8' },
      { key: '15', value: '0' },
      { key: '16', value: '0' },
      { key: '17', value: '0' },
      { key: '18', value: '0' },
      { key: '19', value: '0' },
      { key: '22', value: '' }, // '' 인 경우 비어있어야한다.
    ],
  },
  {
    type: TYPE_AM,
    validate: [
      { key: '38', value: '0' },
      { key: '40', value: '0' },
      { key: '42', value: '0' },
      { key: '44', value: '0' },
      { key: '46', value: '0' },
      { key: '48', value: '0' },
      { key: '50', value: '0' },
      { key: '52', value: '0' },
      { key: '54', value: '0' },
      { key: '55', value: '0' },
      { key: '56', value: '0' },
      { key: '57', value: '0' },
      { key: '58', value: '0' },
      { key: '59', value: '0' },
      { key: '60', value: '0' },
      { key: '63', value: '0' },
    ],
  },
  {
    type: TYPE_ISOLATION_DAY,
    validate: [
      { key: '38', value: '0' },
      { key: '40', value: '0' },
      { key: '42', value: '0' },
      { key: '44', value: '0' },
      { key: '46', value: '0' },
      { key: '48', value: '0' },
      { key: '50', value: '0' },
      { key: '52', value: '0' },
      { key: '54', value: '0' },
      { key: '55', value: '0' },
      { key: '56', value: '0' },
      { key: '57', value: '0' },
      { key: '58', value: '0' },
      { key: '59', value: '0' },
      { key: '60', value: '0' },
      { key: '63', value: '0' },
    ],
  },
  {
    type: TYPE_ISOLATION_DAY_AFTER_30,
    validate: [],
  },
];

const bodyStatusValidator = (type, list) => {
  const options = _find(EXERCISE_BODY_VALIDATE_CONFIG, { type });
  let status = ENUM_BODY_STATUS.STAGE2;
  if (options) {
    _forEach(options.validate, ({ key, value }) => {
      const ans = _find(list, { answerNumber: key });
      if (ans) {
        if (ans.answerValue.trim() !== value) {
          status = ENUM_BODY_STATUS.BAD;
          return false;
        }
      }
    });
  } else {
    status = ENUM_BODY_STATUS.BAD;
  }
  return status;
};

export default {
  state: {
    exerciseList: [],
    exerciseDetail: {},
    exerciseAlarms: [],
    bodyStatus: executor(STORAGE_DATA, STORAGE_KEYS.BODY_CHECK) || ENUM_BODY_STATUS.BAD,
    lastInterviewDate: executor(STORAGE_DATA, STORAGE_KEYS.LAST_INTERVIEW_DATE),
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
    [EXERCISE_REGIST_STATUS](state, { interviewType, answerList }) {
      const status = bodyStatusValidator(interviewType, answerList);
      const today = dayjs().format(ENUM_DATE_FORMAT.YMD);
      state.bodyStatus = status;
      state.lastInterviewDate = today;
      executor(STORAGE_DATA, STORAGE_KEYS.LAST_INTERVIEW_DATE, today);
      executor(STORAGE_DATA, STORAGE_KEYS.BODY_CHECK, status);
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
    [LAST_INTERVIEW_DATE]({ lastInterviewDate }) {
      return lastInterviewDate;
    },
  },
};
