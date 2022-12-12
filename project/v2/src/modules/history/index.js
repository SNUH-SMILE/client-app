import _merge from 'lodash/merge';
import { interviewService } from '@/services/api';
import { RESPONSE_STATUS } from '@/common/constants';
import { LOGIN_ID } from '../patient';

export const SET_INTERVIEW_LIST = 'interview/setInterview';
export const GET_INTERVIEW_LIST = 'interview/interviewList';
export const GET_SYMPTOMLIST = 'interview/getSymptomList';
export const TYPE_CONFIRMED_DAY = '01';
export const TYPE_AM = '02';
export const TYPE_PM = '03';
export const TYPE_ISOLATION_DAY = '04';
export const TYPE_ISOLATION_DAY_AFTER_30 = '05';

export default {
  state: {
    interviewList: [],
    symptomLists: [],
  },
  mutations: {
    [GET_INTERVIEW_LIST](state, interviewList = []) {
      state.interviewList = interviewList;
      // state.symptomLists = symptomLists;
    },
    [GET_SYMPTOMLIST](state, symptomLists = []) {
      state.symptomLists = symptomLists;
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
      const result = await interviewService.setInterview(loginId, interviewType, interviewDate, answerList);
      return result;
    },
  },
  getters: {
    [GET_INTERVIEW_LIST]({ interviewList }) {
      return interviewList;
    },
    [GET_SYMPTOMLIST]({ symptomLists }) {
      return symptomLists;
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
