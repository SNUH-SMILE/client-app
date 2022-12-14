import dayjs from 'dayjs';
import _cloneDeep from 'lodash/cloneDeep';
import _merge from 'lodash/merge';
import _maxBy from 'lodash/maxBy';
import _sumBy from 'lodash/sumBy';
import { ENUM_DATE_FORMAT, ENUM_ISOLATION_TYPE, ENUM_QUARANTINE } from '@/common/constants';
import { mainService } from '@/services/api';
import { LOGIN_ID } from '../patient';
import { STATUS } from '@/native/constants';
const { YMD, HyphenYmd, Hm, SemiHm, HH, mm } = ENUM_DATE_FORMAT;
const INIT_MAIN_CONTENT_DATA = () => ({
  patientNm: '' /*P000000054*/, // 성명 / 확인필요 환자 번호가 넘어오는중
  admissionDate: '' /*20221104*/, // 격리 시작일 (YYYYMMDD)
  dischargeScheduledDate: '' /*20221118*/, // 격리 종료 예정일자 (YYYYMMDD)
  dischargeDate: null, // 격리종료일 (YYYYMMDD)
  personCharge: '' /*홍담당*/, // 담당자 성명
  todayBtList: [
    // 당일 체온
    // {
    //   resultDate: '20221124',
    //   resultTime: '103900',
    //   result2: null,
    //   bt: '36',
    // },
  ],
  todayBpList: [
    // 당일 혈압
    // {
    //   resultDate: '20221124',
    //   resultTime: '103900',
    //   sbp: '120',
    //   dbp: '80',
    // },
  ],
  todayHrList: [
    // 당일 심박수
    // {
    //   resultDate: '20221124',
    //   resultTime: '103900',
    //   result2: null,
    //   hr: '60',
    // },
  ],
  todaySpO2List: [
    // 당일 산소포화도
    // {
    //   resultDate: '20221124',
    //   resultTime: '103900',
    //   result2: null,
    //   spO2: '60',
    // },
  ],
  todayStepCountList: [
    // 당일 걸음 수
    // {
    //   resultDate: '20221124',
    //   resultTime: '103900',
    //   stepCount: '60',
    //   distance: '0',
    // },
  ],
  todayRrList: [], // ?? 확인 필요
  todayTotalSleepTime: '0000' /*0001*/, // 당일 총 수면시간 HHmm
  todaySleepTimeList: [
    // 당일 수면시간 목록
    // {
    //   sleepType: '0', // 0:깊은잠 , 1: 얕은잠, 2: 기상
    //   sleepStartDate: '20221123',
    //   sleepStartTime: '1039',
    //   sleepEndDate: '20221123',
    //   sleepEndTime: '1040',
    // },
  ],
});

export const MAIN_CONTENT = 'main/contents';
export const MAIN_USER_INFO = 'main/userInfo';
export const MAIN_HEALTHS = 'main/healths';
export const MAIN_HISTORY_TAKING = 'main/historyTaking';
export const QUARANTINE_STATUS = 'main/quarantineStatus';
/**
 * 복약 관리 / 운동하기
 */
export default {
  state: {
    contents: INIT_MAIN_CONTENT_DATA(),
    quarantine: ENUM_QUARANTINE.YES,
  },
  mutations: {
    [MAIN_CONTENT](state, payload) {
      state.contents = _merge(INIT_MAIN_CONTENT_DATA(), payload);
    },
    [QUARANTINE_STATUS](state, payload) {
      state.quarantine = payload;
    },
  },
  actions: {
    async [MAIN_CONTENT]({ commit, getters }) {
      const loginId = getters[LOGIN_ID];
      const { data: contentData } = await mainService.mainInfo(loginId);
      const {
        code,
        data: { quarantineStatusDiv },
      } = await mainService.getQuarantineStatus(loginId);

      if (code === STATUS.SUCC) {
        commit(QUARANTINE_STATUS, quarantineStatusDiv);
      }

      commit(MAIN_CONTENT, contentData);
    },
  },
  getters: {
    [MAIN_USER_INFO]({ contents }) {
      const data = _cloneDeep(contents);

      // 1. 격리 기간 모르는 경우 기본 세팅
      let isolationCount = -1;
      let isolationType = ENUM_ISOLATION_TYPE.UNKOWN;
      let admissionDateLabel = '';
      let dischargeScheduledDateLabel = '';
      let dischargeDateLabel = '';

      if (data.admissionDate && data.dischargeScheduledDate) {
        // 2. 격리 입소일, 격리 해제 예정일을 아는 경우
        const admissionDate = dayjs(data.admissionDate, YMD);
        const dischargeScheduledDate = dayjs(data.dischargeScheduledDate, YMD);
        admissionDateLabel = admissionDate.format(HyphenYmd);
        dischargeScheduledDateLabel = dischargeScheduledDate.format(HyphenYmd);

        if (data.dischargeDate) {
          // 4. 격리 해제 일이 있는 경우
          const dischargeDate = dayjs(data.dischargeDate, YMD);
          dischargeDateLabel = dischargeDate.format(HyphenYmd);
          isolationType = ENUM_ISOLATION_TYPE.DISCHARGE;
          isolationCount = dayjs().diff(dischargeDate, 'day', false);
        } else {
          // 3. 격리 해제일이 없는 경우
          isolationType = ENUM_ISOLATION_TYPE.ISOLATION;
          isolationCount = dischargeScheduledDate.diff(dayjs(), 'day', false);
        }
      }

      return {
        isolationType,
        isolationCount,
        admissionDateLabel,
        dischargeScheduledDateLabel,
        dischargeDateLabel,
        centerNm: data.centerNm,
      };
    },
    [MAIN_HEALTHS]({ contents }) {
      const { todayBtList, todayBpList, todayHrList, todayTotalSleepTime, todaySpO2List, todayStepCountList, todayRrList } = contents;
      const toggles = {};
      const datas = {};
      const adapter = (arr, name, key = 'resultTime') => {
        if (arr.length > 0) {
          toggles[name] = true;
          datas[name] = _maxBy(arr, (obj) => obj[key]);
        } else {
          toggles[name];
        }
      };
      adapter(todayBtList, 'bt');
      adapter(todayBpList, 'bp');
      adapter(todayHrList, 'hr');
      adapter(todaySpO2List, 'o2');
      adapter(todayRrList, 'rr');
      // adapter(todayStepCountList, 'step');
      if (todayStepCountList.length === 0) {
        toggles['step'] = false;
      } else {
        toggles['step'] = true;
        datas['step'] = { todayCount: _sumBy(todayStepCountList, ({ stepCount }) => Number(stepCount)) };
      }

      if (todayTotalSleepTime && todayTotalSleepTime !== '0000') {
        const sleepTime = dayjs(todayTotalSleepTime, Hm);
        toggles['sleep'] = true;
        datas['sleep'] = {
          hh: sleepTime.format(HH),
          mm: sleepTime.format(mm),
        };
      } else {
        toggles['sleep'] = false;
      }

      return { datas, toggles };
    },
    [QUARANTINE_STATUS](state) {
      return state.quarantine === ENUM_QUARANTINE.YES;
    },
  },
};
