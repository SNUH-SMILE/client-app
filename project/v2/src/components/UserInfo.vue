<template>
  <div class="user-info">
    <div class="user-info-data">
      <div class="user">
        <strong class="name" v-text="session.patientNm">김하나</strong>
        <span class="lb-txt green" v-if="quarantine === quarantineStatus.YES">정상</span>
        <span class="lb-txt red" v-else>이탈</span>
        <!-- <span class="lb-txt orange">격리중</span> -->
      </div>
      <ul class="user-info-list">
        <li v-if="info.isolationType !== isolationTypes.UNKOWN">
          <span class="ic-ttl calendar">격리 기간</span> : {{ info.admissionDateLabel }} ~ {{ info.dischargeScheduledDateLabel }}
        </li>
        <li v-else><span class="ic-ttl calendar">격리 기간</span> : 정확한 격리 기간을 확인 후 조회 가능합니다.</li>
        <li><span class="ic-ttl location">격리 위치</span> : {{ info.centerNm }}</li>
      </ul>
    </div>

    <p class="user-info-txt">
      <template v-if="info.isolationType === isolationTypes.ISOLATION">
        <template v-if="info.isolationCount > -1">
          격리 해제까지 <strong class="iht">{{ info.isolationCount }}일</strong> 남았습니다.
        </template>
        <template v-else>
          격리 해제 예정일 기준 <strong class="iht">{{ Math.abs(info.isolationCount) }}일</strong>이 지났습니다.
        </template>
      </template>
      <template v-else-if="info.isolationType === isolationTypes.DISCHARGE">
        격리 해제 후 <strong class="iht">{{ info.isolationCount }}일</strong>이 지났습니다.
      </template>
      <template v-else> 정확한 격리 기간을 확인 후 조회 가능합니다. </template>
    </p>
  </div>
</template>

<script>
import { SESSION } from '@/modules/patient';
import { mapActions, mapGetters } from 'vuex';
import { MAIN_USER_INFO, QUARANTINE_STATUS } from '@/modules/main';
import { ENUM_ISOLATION_TYPE } from '@/common/constants';
export default {
  computed: {
    ...mapGetters({ session: SESSION, info: MAIN_USER_INFO, quarantine: QUARANTINE_STATUS }),
    isolationTypes() {
      return ENUM_ISOLATION_TYPE;
    },
    quarantineStatus() {
      return QUARANTINE_STATUS;
    },
  },
};
</script>

<style></style>
