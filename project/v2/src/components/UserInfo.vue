<template>
  <div class="user-info">
    <div class="user-info-data">
      <div class="user">
        <strong class="name" v-text="session.patientNm">김하나</strong>
        <span class="lb-txt green" v-if="quarantine">정상</span>
        <span class="lb-txt red" v-else>이탈</span>
        <!-- <span class="lb-txt orange">격리중</span> -->
      </div>
      <ul class="user-info-list">
        <li><span class="ic-ttl calendar">격리 기간</span> : {{ info.admissionDateLabel }} ~ {{ info.dischargeScheduledDateLabel }}</li>
        <li><span class="ic-ttl location">격리 위치</span> : 제1생활치료센터 101호(API필요)</li>
      </ul>
    </div>
    <p v-if="info.discargeCount > 0" class="user-info-txt">
      격리 해제까지 <strong class="iht">{{ info.discargeCount }}일</strong> 남았습니다.
    </p>
    <p class="user-info-txt" v-else>정확한 격리 기간을 확인 후 조회 가능합니다.</p>
  </div>
</template>

<script>
import { SESSION } from '@/modules/patient';
import { mapActions, mapGetters } from 'vuex';
import { MAIN_USER_INFO, QUARANTINE_STATUS } from '@/modules/main';
export default {
  created() {
    this.fetchSession();
  },
  computed: {
    ...mapGetters({ session: SESSION, info: MAIN_USER_INFO, quarantine: QUARANTINE_STATUS }),
  },
  methods: {
    ...mapActions({ fetchSession: SESSION }),
  },
};
</script>

<style></style>
