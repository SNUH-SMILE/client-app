import { etcService } from '@/services/server/api';
import { LOGIN_ID } from '../patient';

export const NOTICE_LIST = 'etc/noticeList';

export default {
  state: {
    noticeList: [],
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
  },
  getters: {
    [NOTICE_LIST]({ noticeList }) {
      return noticeList;
    },
  },
};
