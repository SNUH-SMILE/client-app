<template>
  <div class="wrapper" :class="warpCls">
    <router-view />
    <top-button v-if="showTopBtn" :class="{ 'tb-left-btm': leftTopBtn, 'is-btm': isMobile }" />
  </div>
</template>
<script>
import { mapState } from 'vuex';
import TopButton from '@/common/components/TopButton.vue';
export default {
  components: {
    TopButton,
  },
  data() {
    return {
      exitFlag: true,
    };
  },
  created() {
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
