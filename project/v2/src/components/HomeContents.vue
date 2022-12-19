<template>
  <div class="content">
    <div class="cont-inner tb-full">
      <app-home-interview />

      <section class="section-box">
        <div class="section-ttl-box">
          <h2 class="section-ttl">비대면 진료</h2>
          <!-- <router-link custom v-slot="{ navigate }" :to="{ name: 'doctor' }">
            <button type="button" class="btn-ic-txt arrow" @click="navigate">바로가기</button>
          </router-link> -->
        </div>
        <div class="nodata-box">
          <!-- <p class="ic-txt diagnosis">오늘 예약된 비대면 진료가 없습니다.</p> -->
          <p class="ic-txt diagnosis">비대면 진료가 시작되면 푸시로 알려드립니다.</p>
        </div>

        <!-- <div class="info-center-box" v-if="diagnosisShow">
          <p class="txt-info"><strong class="ic-txt diagnosis">14:30</strong>에 예약된 진료가 있습니다.</p>
        </div> -->
      </section>

      <app-home-healths @refresh="fetchAndSync" />
      <app-home-medicine />
      <app-home-exercise />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { MAIN_CONTENT } from '@/modules/main';
import AppHomeHealths from '@/modules/main/AppHomeHealths.vue';
import AppHomeExercise from '@/modules/main/AppHomeExercise.vue';
import AppHomeMedicine from '@/modules/main/AppHomeMedicine.vue';
import AppHomeInterview from '@/modules/main/AppHomeInterview.vue';
import { GET_BAND_ALL_DATA, IS_BAND_CONNECT, SUCC_SYNC_BAND_DATA } from '@/native/band';
import { DEVICE_INFO, IS_GARMIN_DEVICE, LOGIN_ID, SESSION } from '@/modules/patient';
import { healthService } from '@/services/api';
import { RESPONSE_STATUS } from '@/common/constants';
import { addSeersAccount } from '@/common/helpers';
// import _each from 'lodash/each';
// const DETAIL_BEALTH_FUNC_NM = '__onDetailHealthCB';
// const ON_CNANGE_TEMP_FUNC_NM = 'onChangeTemp';
// const ON_CHANGE_STEP_FUNC_NM = 'onChangeStep';
// const ON_CHANGE_RATE_FUNC_NM = 'onChangeRate';
export default {
  components: { AppHomeHealths, AppHomeExercise, AppHomeMedicine, AppHomeInterview },
  name: 'home-contents',
  data() {
    return {
      diagnosisShow: false, //비대면 진료
      pillShow: false, //복약관리
      // exerciseShow: true, //운동하기
    };
  },

  async activated() {
    await this.fetchSession();
    const { searsAccount } = this.session;
    if (searsAccount) {
      addSeersAccount(this.loginId, searsAccount);
    }
    this.fetchAndSync();
  },
  computed: {
    ...mapGetters({ isGarminDevice: IS_GARMIN_DEVICE, session: SESSION, loginId: LOGIN_ID }),
  },
  methods: {
    ...mapActions({ fetchContents: MAIN_CONTENT, fetchDeviceInfo: DEVICE_INFO, fetchSession: SESSION }),
    async fetchAndSync() {
      await this.fetchDeviceInfo();
      if (!this.isGarminDevice) {
        if (this.$nativeScript(IS_BAND_CONNECT)) {
          const { code, message, data } = await this.$nativeScript(GET_BAND_ALL_DATA);
          const res = await healthService.setTotalResult(this.loginId, data);
          if (res.code === RESPONSE_STATUS.SUCCESS) {
            this.$nativeScript(SUCC_SYNC_BAND_DATA);
          } else {
            this.$toast('서버 동기화를 실패하였습니다.');
          }
        } else {
          this.$toast('디바이스가 연결되어있지 않습니다.');
        }
      }

      this.fetchContents();
    },
  },
};
</script>

<style></style>
