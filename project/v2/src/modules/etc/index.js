import { ENUM_DATE_FORMAT, STORAGE_KEYS } from '@/common/constants';
import { executor } from '@/native';
import { etcService } from '@/services/api';
import dayjs from 'dayjs';
import { LOGIN_ID } from '../patient';
import { STORAGE_DATA } from '@/native/data';

const { YMD, PeriodYmd } = ENUM_DATE_FORMAT;

export const NOTICE_LIST = 'etc/noticeList';
export const QUESTION_LIST = 'etc/questionList';
export const QUESTION_REGIST = 'etc/questionRegist';
export const PATIENT_NOTICE_LIST = 'etc/patientNoticeList';
export const IS_NEW_NOTICE = 'etc/isNewNotice';
export const LAST_NOTICE_READ_CNT = 'etc/lastNoticeReadCnt';

export default {
  state: {
    noticeList: [],
    questionList: [],
    patientNoticeList: [],
    lastPatientNoticeCnt: executor(STORAGE_DATA, STORAGE_KEYS.LAST_ALRAM_NOTICE_CNT) || 0,
  },
  mutations: {
    [NOTICE_LIST](state, payload = []) {
      state.noticeList = payload;
    },
    [QUESTION_LIST](state, payload = []) {
      state.questionList = payload;
    },
    [PATIENT_NOTICE_LIST](state, payload = []) {
      state.patientNoticeList = payload;
    },
    [LAST_NOTICE_READ_CNT](state, payload = 0) {
      state.lastPatientNoticeCnt = payload;
      executor(STORAGE_DATA, STORAGE_KEYS.LAST_ALRAM_NOTICE_CNT, payload);
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
    async [PATIENT_NOTICE_LIST]({ commit, getters }) {
      const loginId = getters[LOGIN_ID];
      const {
        data: { result },
      } = await etcService.patientNoticeList(loginId);
      commit(PATIENT_NOTICE_LIST, result);
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
        o.answerDateLabel = dayjs(o.answerDate, YMD).format(PeriodYmd);
        return o;
      });
    },
    [PATIENT_NOTICE_LIST]({ patientNoticeList }) {
      return patientNoticeList.map((o) => {
        o.noticeDateLabel = dayjs(o.noticeDate, YMD).format(PeriodYmd);
        return o;
      });
    },
    [IS_NEW_NOTICE]({ lastPatientNoticeCnt, patientNoticeList }) {
      return patientNoticeList.length > lastPatientNoticeCnt;
    },
  },
};
