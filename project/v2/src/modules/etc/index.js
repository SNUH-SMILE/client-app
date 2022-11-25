import { etcService } from '@/services/api';
import { LOGIN_ID } from '../patient';

export const NOTICE_LIST = 'etc/noticeList';
export const QUESTION_LIST = 'etc/questionList';
export default {
  state: {
    noticeList: [],
    questionList: [],
  },
  mutations: {
    [NOTICE_LIST](state, payload = []) {
      state.noticeList = payload;
    },
  },
  actions: {
    async [NOTICE_LIST]({ commit, getters }) {
      const loginId = getters[LOGIN_ID];
      const {
        code,
        message,
        data: { noticeList },
      } = await etcService.supportNoticeList(loginId);
      commit(NOTICE_LIST, noticeList);
    },
    async [QUESTION_LIST]({ commit, getters }) {
      const loginId = getters[LOGIN_ID];
      const { data } = await etcService.supportQuestionList(loginId);
      commit(QUESTION_LIST, data);
    },
  },
  getters: {
    [NOTICE_LIST]({ noticeList }) {
      return noticeList;
    },
    [QUESTION_LIST]({ questionList }) {
      return questionList;
    },
  },
};
