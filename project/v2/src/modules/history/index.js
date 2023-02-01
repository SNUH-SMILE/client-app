import _merge from 'lodash/merge';
import _cloneDeep from 'lodash/cloneDeep';
import _forEach from 'lodash/forEach';
import _find from 'lodash/find';
import { interviewService } from '@/services/api';
import { ENUM_DATE_FORMAT, RESPONSE_STATUS, STORAGE_KEYS } from '@/common/constants';
import { LOGIN_ID } from '../patient';
import dayjs from 'dayjs';
import { executor } from '@/native';
import { STORAGE_DATA } from '@/native/data';

/* import 순서에 따른 에러 임시 처리.. */
const EXERCISE_REGIST_STATUS = 'exercise/registStatus';
export const SET_INTERVIEW_LIST = 'interview/setInterview';
export const GET_INTERVIEW_LIST = 'interview/interviewList';
export const GET_SYMPTOMLIST = 'interview/getSymptomList';
export const GET_SYMPTOMLIST_BY_LOCAL = 'interview/getSymptomListByLocal';
export const LAST_AMPM_INTERVIEW = 'interview/lastApmpInterview';
export const TYPE_CONFIRMED_DAY = '01';
export const TYPE_AM = '02';
export const TYPE_PM = '03';
export const TYPE_ISOLATION_DAY = '04';
export const TYPE_ISOLATION_DAY_AFTER_30 = '05';

const INIT_AMPM_INTERVIEW_DATA = () => ({
  interviewDate: '', // 202302010224
  answerList: [], // { answerNumber: '40', answerValue: '0' }
});

const SYMPTOM_LABEL_MAP = [
  { key: '38', label: '기침' },
  { key: '40', label: '가래' },
  { key: '42', label: '발열' },
  { key: '44', label: '콧물' },
  { key: '46', label: '인후통' },
  { key: '48', label: '호흡곤란' },
  { key: '50', label: '흉통' },
  { key: '54', label: '오심' },
  { key: '55', label: '구토' },
  { key: '56', label: '복부 불편감' },
  { key: '57', label: '변비' },
  { key: '58', label: '설사' },
  { key: '59', label: '복통' },
  { key: '60', label: '통증' },
  { key: '62', label: '수면장애' },
];

export default {
  state: {
    interviewList: [],
    symptomLists: [],
    lastAmpmInterview: executor(STORAGE_DATA, STORAGE_KEYS.LAST_AMPM_INTERVIEW_ANSWER) || INIT_AMPM_INTERVIEW_DATA(),
  },
  mutations: {
    [GET_INTERVIEW_LIST](state, interviewList = []) {
      state.interviewList = interviewList;
      // state.symptomLists = symptomLists;
    },
    [GET_SYMPTOMLIST](state, symptomLists = []) {
      state.symptomLists = symptomLists;
    },
    [LAST_AMPM_INTERVIEW](state, payload) {
      executor(STORAGE_DATA, STORAGE_KEYS.LAST_AMPM_INTERVIEW_ANSWER, payload);
      state.lastAmpmInterview = payload;
    },
  },
  actions: {
    async [GET_INTERVIEW_LIST]({ commit, getters }, requestDate) {
      const loginId = getters[LOGIN_ID];
      const { code, message, data } = await interviewService.interviewList(loginId, requestDate);
      if (code === RESPONSE_STATUS.SUCCESS) {
        commit(GET_INTERVIEW_LIST, data.result.interviewList);
        commit(GET_SYMPTOMLIST, data.result.symptomLists);
      }
      return data;
    },
    async [SET_INTERVIEW_LIST]({ commit, getters }, { interviewType, interviewDate, answerList }) {
      const loginId = getters[LOGIN_ID];
      commit(EXERCISE_REGIST_STATUS, {
        interviewType,
        answerList,
      });
      if (interviewType === TYPE_AM) {
        commit(LAST_AMPM_INTERVIEW, {
          interviewDate,
          answerList,
        });
      }
      const result = await interviewService.setInterview(loginId, interviewType, interviewDate, answerList);
      return result;
    },
  },
  getters: {
    [GET_INTERVIEW_LIST]({ interviewList }) {
      const list = _cloneDeep(interviewList);
      return list.map((item) => {
        if (item.interviewTime) {
          const interviewTime = dayjs(item.interviewTime, ENUM_DATE_FORMAT.Hm);
          item.interviewTimeLabel = interviewTime.format(ENUM_DATE_FORMAT.SemiHm);
        }
        if (item.interviewType === '00') item.interviewType = TYPE_CONFIRMED_DAY;
        return item;
      });
    },
    [GET_SYMPTOMLIST]({ symptomLists }) {
      const list = _cloneDeep(symptomLists);
      return list.map((item) => {
        if (item.symptomTitle.length > 0) {
          item.symptomTitleLabel = item.symptomTitle.split(', ');
        } else {
          item.symptomTitleLabel = '';
        }
        return item;
      });
    },
    [GET_SYMPTOMLIST_BY_LOCAL]({ lastAmpmInterview: { interviewDate, answerList } }) {
      const list = [];
      if (interviewDate.substring(0, 8) === dayjs().format(ENUM_DATE_FORMAT.YMD)) {
        // 오늘날짜인 경우
        _forEach(answerList, ({ answerNumber, answerValue }) => {
          if (answerValue === '1') {
            const exist = _find(SYMPTOM_LABEL_MAP, { key: answerNumber }) || {};
            if (exist) {
              list.push(exist.label);
            }
          }
        });
      }
      return list;
    },
  },
};

export function initForm(historyTakingList) {
  const valueForm = {
    CheckboxFactory: { value: [] },
    InputFactory: { value: '' },
    PointFactory: { value: '' },
    RadioFactory: { value: '' },
    RadioCalendar: { value: '' },
  };

  const list = [];
  historyTakingList.forEach((element) => {
    // if (Object.prototype.hasOwnProperty.call(valueForm, element.answerType)) {
    list.push(_merge(element, valueForm[element.answerType]));
    // }
  });

  return list;
}

export function submitForm(form) {
  const getSubmitForm = (cur) => {
    let value = cur.value;
    // TODO : list > string 으로 바꿈 api 수정 요청 후 다시 바꾸기
    if (typeof cur.value === 'object') {
      value = cur.value.toString();
    }
    return {
      answerNumber: cur.order,
      answerValue: value,
    };
  };
  const result = [];
  form.forEach((formItem) => {
    if (formItem.value !== '') {
      result.push(getSubmitForm(formItem));
    }
  });
  return result;
}
