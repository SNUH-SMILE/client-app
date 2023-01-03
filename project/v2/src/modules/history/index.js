import _merge from 'lodash/merge';
import _cloneDeep from 'lodash/cloneDeep';
import { interviewService } from '@/services/api';
import { ENUM_DATE_FORMAT, RESPONSE_STATUS } from '@/common/constants';
import { LOGIN_ID } from '../patient';
import dayjs from 'dayjs';

/* import 순서에 따른 문제 처리.. */
const EXERCISE_REGIST_STATUS = 'exercise/registStatus';
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
      commit(EXERCISE_REGIST_STATUS, {
        interviewType,
        answerList,
      });
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
        if (item.interviewType === '00') item.interviewType = '01';
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
