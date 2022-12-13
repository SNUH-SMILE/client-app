import _cloneDeep from 'lodash/cloneDeep';
import _sortBy from 'lodash/sortBy';
import { ENUM_DATE_FORMAT, FORM_DRUG_TYPE } from '@/common/constants';
import { drugService } from '@/services/api';
import dayjs from 'dayjs';
import { LOGIN_ID } from '../patient';

export const MEDICINE_NOTICE_LIST = 'medicine/noticeList';
export const MEDICINE_NOTICE_LIST_BY_TIME = 'medicine/noticeListByTime';
export const MEDICINE_TIMELINE_LIST = 'medicine/timelineList';

export default {
  state: {
    noticeList: [],
    timeLineList: [],
  },
  mutations: {
    [MEDICINE_NOTICE_LIST](state, payload = []) {
      state.noticeList = payload;
    },
    [MEDICINE_TIMELINE_LIST](state, payload = []) {
      state.timeLineList = payload;
    },
  },
  actions: {
    async [MEDICINE_NOTICE_LIST]({ commit, getters }, requestDate) {
      // commit(MEDICINE_NOTICE_LIST);
      const loginId = getters[LOGIN_ID];
      const {
        data: { result },
      } = await drugService.noticeList(loginId, requestDate);
      const { noticeList } = result;
      commit(MEDICINE_NOTICE_LIST, noticeList);
      return noticeList;
    },
    async [MEDICINE_TIMELINE_LIST]({ commit, getters }, requestDate) {
      // commit(MEDICINE_TIMELINE_LIST);
      const loginId = getters[LOGIN_ID];
      const {
        data: { result },
      } = await drugService.timeList(loginId, requestDate);
      const { drugTimeList } = result;
      commit(MEDICINE_TIMELINE_LIST, drugTimeList);
      return drugTimeList;
    },
  },
  getters: {
    [MEDICINE_NOTICE_LIST]({ noticeList }) {
      const result = _sortBy(_cloneDeep(noticeList), ({ noticeTime }) => {
        return Number(noticeTime.replace(':', ''));
      });
      return result.map((item) => {
        item.noticeTimeLabel = dayjs(item.noticeTime.replace(':', ''), ENUM_DATE_FORMAT.Hm).format(ENUM_DATE_FORMAT.SemiHm);
        item.drugList = item.drugList.map((drug) => {
          const data = FORM_DRUG_TYPE.find((type) => type.value === drug.drugType);
          drug.drugTypeLabel = data ? data.label : drug.drugType;
          return drug;
        });
        return item;
      });
    },
    [MEDICINE_TIMELINE_LIST]({ timeLineList }) {
      return timeLineList.map((item) => {
        item.timeLabel = dayjs(item.takeTime, ENUM_DATE_FORMAT.Hm).format(ENUM_DATE_FORMAT.SemiHm);
        item.drugList = item.drugList.map((drug) => {
          const data = FORM_DRUG_TYPE.find((type) => type.value === drug.drugType);
          drug.drugTypeLabel = data ? data.label : drug.drugType;
          return drug;
        });
        return item;
      });
    },
    [MEDICINE_NOTICE_LIST_BY_TIME]({ noticeList }) {
      const list = _sortBy(_cloneDeep(noticeList), ({ noticeTime }) => {
        return Number(noticeTime.replace(':', ''));
      });
      const result = [];
      list.forEach((item) => {
        const noticeTime = item.noticeTime.replace(':', '');
        let exist = result.find(({ time }) => time === noticeTime);
        if (!exist) {
          exist = {
            time: noticeTime,
            timeLabel: dayjs(noticeTime, ENUM_DATE_FORMAT.Hm).format(ENUM_DATE_FORMAT.SemiHm),
            contents: [],
          };
          result.push(exist);
        }
        item.noticeTimeLabel = dayjs(noticeTime, ENUM_DATE_FORMAT.Hm).format(ENUM_DATE_FORMAT.SemiHm);
        item.drugList = item.drugList.map((drug) => {
          const data = FORM_DRUG_TYPE.find((type) => type.value === drug.drugType);
          drug.drugTypeLabel = data ? data.label : drug.drugType;
          return drug;
        });
        exist.contents.push(item);
      });
      return result;
    },
  },
};
