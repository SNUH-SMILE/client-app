<template>
  <div class="cont-inner mb-space20 tb-space20">
    <div class="txt-info-box">
      <h2 class="ttl">알림 설정 목록</h2>
      <p class="txt">복약 알림을 설정 하셨나요? <br />클릭만으로 간편하게 <br class="tb-none" />체크해 보세요.</p>
    </div>
    <section class="section-box02" v-for="item in list" :key="`medicine-check-${item.time}`">
      <h2 class="ttl-b">{{ item.timeLabel }}</h2>
      <ul class="medicine-list line-box">
        <li v-for="alarm in item.contents" :key="`medicine-alarm-${alarm.drugAlarmSeq}`">
          <span class="ttl">{{ alarm.noticeName }}</span>
          <div class="right-area">
            <p class="ipt-rdo-txt">
              <template v-if="alarm.takeResult === '2'">
                <input type="radio" :id="`eat-no-${alarm.drugAlarmSeq}`" checked @click="changeTakeResult(alarm)" />
                <label :for="`eat-no-${alarm.drugAlarmSeq}`">복약체크</label>
              </template>
              <template v-else>
                <input type="radio" :id="`eat-yes-${alarm.drugAlarmSeq}`" disabled />
                <label :for="`eat-yes-${alarm.drugAlarmSeq}`">복약함</label>
              </template>
            </p>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import { drugService } from '@/services/api';
import { mapActions, mapGetters } from 'vuex';
import { MEDICINE_NOTICE_LIST, MEDICINE_NOTICE_LIST_BY_TIME } from '.';
import { LOGIN_ID } from '../patient';
import { ENUM_DATE_FORMAT } from '@/common/constants';
export default {
  created() {},
  computed: {
    ...mapGetters({ list: MEDICINE_NOTICE_LIST_BY_TIME, loginId: LOGIN_ID }),
  },
  methods: {
    ...mapActions({ fetchList: MEDICINE_NOTICE_LIST }),
    async changeTakeResult(alarm) {
      const loginId = this.loginId;
      const { drugAlarmSeq } = alarm;
      const today = this.$dayjs();
      const resultDate = today.format(ENUM_DATE_FORMAT.YMD);
      const resultTime = today.format(ENUM_DATE_FORMAT.Hm);
      await drugService.setTakeResult(loginId, drugAlarmSeq, resultDate, resultTime, '1');
      this.$emit('refetch');
      this.$toast('복약 체크되었습니다.');
    },
  },
};
</script>

<style></style>
