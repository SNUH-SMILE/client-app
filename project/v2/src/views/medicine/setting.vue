<template>
  <div class="content-wrap">
    <div class="content">
      <div class="cont-inner pt0 tb-w100p">
        <ul class="md-set-list">
          <li>
            <div class="hbox jc">
              <p class="ttl">복용 시작일</p>
              <div class="right-area">
                <strong class="txt txtc-blue">{{ today }}</strong>
              </div>
            </div>
          </li>
          <li>
            <div class="hbox jc">
              <p class="ttl">복용 일수</p>
              <div class="right-area">
                <p class="ipt-select">
                  <select title="복용 일수" v-model="state.noticeDate" name="noticeDate">
                    <option value="1">1일</option>
                    <option value="2">2일</option>
                    <option value="3">3일</option>
                    <option value="4">4일</option>
                    <option value="5">5일</option>
                    <option value="6">6일</option>
                    <option value="7">7일</option>
                  </select>
                </p>
              </div>
            </div>
          </li>
          <li>
            <div class="hbox jc">
              <p class="ttl">약봉투 이름</p>
              <div class="right-area">
                <div class="ipt-wrap">
                  <text-field class="full" type="text" title="약물 이름" placeholder="입력해 주세요." v-model="state.noticeName" />
                </div>
              </div>
            </div>
          </li>
          <li>
            <div class="hbox jc">
              <p class="ttl">약물 정보</p>
              <div class="right-area">
                <button type="button" class="btn-line-rnd" @click="addDrugForm">추가</button>
              </div>
            </div>
            <medicine-item v-for="(item, index) in state.drugList" :key="index" v-model="state.drugList[index]" />
          </li>
          <li>
            <div class="hbox jc">
              <p class="ttl">알림 시간</p>
              <div class="right-area">
                <button type="button" class="btn-line-rnd" @click="addAlarm">추가</button>
              </div>
            </div>
            <ul class="sub-info-box">
              <medicine-alarm v-for="(item, index) in state.noticeTimeList" :key="index" v-model="state.noticeTimeList[index].noticeTime">
                알람 {{ index + 1 }}
              </medicine-alarm>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <div class="btn-wrap">
      <button type="button" class="btn-txt navy" @click="submit" :disabled="!isActiveSaveButton">저장</button>
    </div>
  </div>
</template>
<route>
{
  "meta": {
    "title": "복약 알림 설정"
  }
}
</route>
<script>
import MedicineItem from '@/components/MedicineItem.vue';
import MedicineAlarm from '@/components/MedicineAlarm.vue';
import { ENUM_ALARM_TYPE, ENUM_DATE_FORMAT } from '@/common/constants';
import dayjs from 'dayjs';
import { mapGetters } from 'vuex';
import { LOGIN_ID } from '@/modules/patient';
import { drugService } from '@/services/api';
import { MULTI_REGIST_LOCAL_ALARM, SYNC_LOCAL_ALARM } from '@/native/alarm';

const INIT_STATE = () => ({
  noticeName: '',
  drugList: [],
  noticeTimeList: [],
  noticeDate: '1',
});

const INIT_DRUG_ITEM = () => ({
  drugName: '',
  drugCount: '',
  drugType: '0',
});

const getCloseTime = () => {
  let today = dayjs();
  const minute = today.minute();
  let min = 0;
  if (minute < 50) {
    min = (Math.floor(minute / 10) + 1) * 10;
  } else {
    today = today.add(1, 'hour');
  }
  today = today.minute(min);
  return today.format('HH:mm');
};

const INIT_TIME_ITEM = () => ({
  noticeTime: getCloseTime(),
});

export default {
  components: {
    MedicineItem,
    MedicineAlarm,
  },
  data() {
    return {
      state: INIT_STATE(),
      today: this.$dayjs().format(ENUM_DATE_FORMAT.PeriodYmd),
    };
  },
  methods: {
    async submit() {
      const err = this.validation();
      if (err) return this.$alert(err);
      const { noticeDate, noticeName, drugList, noticeTimeList: alarmList } = this.state;
      const noticeTimeList = alarmList.map((o) => {
        o.noticeTime = o.noticeTime.replace(':', '');
        return o;
      });

      const noticeStartDate = this.$dayjs().format(ENUM_DATE_FORMAT.YMD);
      const noticeEndDate = this.$dayjs().add(noticeDate, 'day').format(ENUM_DATE_FORMAT.YMD);
      const loginId = this.loginId;
      await drugService.setNotice(loginId, noticeStartDate, noticeEndDate, noticeDate, noticeName, drugList, noticeTimeList);

      const createPushContents = () => {
        let count = Number(noticeDate);
        let date = this.$dayjs().subtract(1, 'day');
        let uniqueId = this.$dayjs().unix();
        const result = [];
        while (count > 0) {
          date = date.add(1, 'day');
          uniqueId += 1;
          noticeTimeList.forEach(({ noticeTime }) => {
            const alarmDate = this.$dayjs(date.format(ENUM_DATE_FORMAT.YMD) + noticeTime, ENUM_DATE_FORMAT.YMD + ENUM_DATE_FORMAT.Hm).format(
              `${ENUM_DATE_FORMAT.HyphenYmd} ${ENUM_DATE_FORMAT.SemiHm}:00`
            );
            result.push({
              id: `${uniqueId}`, // id 컬럼..?
              title: '복약 시간 알림',
              body: `등록하신 "${noticeName}"을 복용하실 시간입니다.`,
              type: ENUM_ALARM_TYPE.MEDICINE,
              date: alarmDate,
              ext: {
                action: ENUM_ALARM_TYPE.MEDICINE,
              },
            });
          });
          count -= 1;
        }
        return result;
      };
      await this.$nativeScript(MULTI_REGIST_LOCAL_ALARM, createPushContents());
      this.$nativeScript(SYNC_LOCAL_ALARM);

      this.$toast('알림 설정 내용이 저장되었습니다.');
      this.$router.back();
    },
    addDrugForm() {
      this.state.drugList.push(INIT_DRUG_ITEM());
    },
    addAlarm() {
      this.state.noticeTimeList.push(INIT_TIME_ITEM());
    },
    validation() {
      let err = '';
      this.state.drugList.forEach(({ drugName, drugCount, drugType }) => {
        if (drugName.length === 0) {
          err = '약물 이름을 입력해 주세요.';
          return false;
        }
      });
      return err;
    },
  },
  computed: {
    ...mapGetters({ loginId: LOGIN_ID }),
    isActiveSaveButton() {
      return this.state.noticeName.length > 0 && this.state.drugList.length > 0 && this.state.noticeTimeList.length > 0;
    },
  },
};
</script>

<style></style>
