<template>
  <div class="wrapper" :class="warpCls">
    <router-view />
    <top-button v-if="showTopBtn" :class="{ 'tb-left-btm': leftTopBtn, 'is-btm': isMobile }" />
  </div>
</template>
<script>
import { mapState } from 'vuex';
import _find from 'lodash/find';
import TopButton from '@/common/components/TopButton.vue';
import { ENUM_DATE_FORMAT } from './common/constants';
export default {
  components: {
    TopButton,
  },
  data() {
    return {
      exitFlag: true,
    };
  },
  async created() {
    M.onBack(() => {
      // TODO: 특정 화면에서의 처리 필요 또한
      if (['home', 'login'].includes(this.$route.name)) {
        if (this.exitFlag) {
          this.$toast('한번 더 누르시면 앱이 종료됩니다.');
          this.exitFlag = false;
          setTimeout(() => {
            this.exitFlag = true;
          }, 1000);
        } else {
          M.sys.exit();
        }
      } else {
        this.$router.go(-1);
      }
    });
    this.$store.commit('syncAppInfo');

    const { TYPE_AM, TYPE_CONFIRMED_DAY, TYPE_ISOLATION_DAY, TYPE_ISOLATION_DAY_AFTER_30, TYPE_PM, GET_INTERVIEW_LIST } = await import(
      '@/modules/history'
    );
    this.$eventBus.$on('writeInterview', async (interviewType) => {
      // 완료 또는 기한이 지난 경우에 대한 유효성 체크를 한다.
      const {
        result: { interviewList },
      } = await this.$store.dispatch(GET_INTERVIEW_LIST, this.$dayjs().format(ENUM_DATE_FORMAT.YMD));
      const exist = _find(interviewList, { interviewType });
      if (!exist) return this.$alert('만료된 문진입니다.');
      if (exist.interviewStatus !== '0') return this.$alert(`완료된 문진이거나 현재는 문진을 진행할 수 없습니다.<br>(type:${exist.interviewStatus})`);
      let name;
      switch (interviewType) {
        case TYPE_CONFIRMED_DAY:
          name = 'history-taking-confirmed-day';
          break;
        case TYPE_ISOLATION_DAY:
          name = 'history-taking-isolation-clear';
          break;
        case TYPE_ISOLATION_DAY_AFTER_30:
          name = 'history-taking-isolation-clear-30';
          break;
        case TYPE_AM:
        case TYPE_PM:
        default:
          name = 'history-taking-am-pm';
          break;
      }
      this.$router.push({ name });
    });
  },
  computed: {
    ...mapState({
      isMobile: 'isMobile',
    }),
    warpCls() {
      return this.$route.meta.warpCls;
    },
    showTopBtn() {
      return this.$route.meta.showTopBtn;
    },
    leftTopBtn() {
      return !this.isMobile && ['customer-inquiry', 'customer-notice'].includes(this.$route.name);
    },
  },
};
</script>
