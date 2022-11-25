import { ENUM_DATE_FORMAT } from '@/common/constants';
import { etcService } from '@/services/api';
import dayjs from 'dayjs';
import { LOGIN_ID } from '../patient';

const { YMD, PeriodYmd } = ENUM_DATE_FORMAT;

export const NOTICE_LIST = 'etc/noticeList';
export const QUESTION_LIST = 'etc/questionList';
export const QUESTION_REGIST = 'etc/questionRegist';
export default {
  state: {
    noticeList: [],
    questionList: [],
  },
  mutations: {
    [NOTICE_LIST](state, payload = []) {
      state.noticeList = payload;
    },
    [QUESTION_LIST](state, payload = []) {
      state.questionList = payload;
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
      const {
        data: { questionList },
      } = await etcService.supportQuestionList(loginId);
      commit(QUESTION_LIST, questionList);
    },
    async [QUESTION_REGIST]({ getters }, { questionTitle, questionBody }) {
      const loginId = getters[LOGIN_ID];
      return await etcService.supportSetQuestion(loginId, questionTitle, questionBody);
    },
  },
  getters: {
    [NOTICE_LIST]({ noticeList }) {
      return noticeList.map((o) => {
        o.noticeDateLabel = dayjs(o.noticeDate, YMD).format(PeriodYmd);
        return o;
      });
    },
    [QUESTION_LIST]({ questionList }) {
      return questionList.map((o) => {
        o.questionDateLabel = dayjs(o.questionDate, YMD).format(PeriodYmd);
        o.answerDateLabel = dayjs(o.anawerDate, YMD).format(PeriodYmd);
        return o;
      });
    },
  },
};
