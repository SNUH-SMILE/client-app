<template>
  <div class="wrapper" :class="warpCls">
    <router-view />
    <top-button v-if="showTopBtn" :class="{ 'tb-left-btm': !isMobile, 'is-btm': isMobile }" />
  </div>
</template>
<script>
import { mapState } from 'vuex';
import TopButton from '@/common/components/TopButton.vue';
export default {
  components: {
    TopButton,
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
  },
};
</script>
