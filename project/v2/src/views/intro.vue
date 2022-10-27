<template>
  <div class="intro-wrap">
    <div class="center-box">
      <h1 class="logo-box">
        <span class="logo">
          <span class="txt-blind">SMILE</span>
        </span>
        <span class="app-txt"><strong>자가격리</strong> APP</span>
      </h1>
      <div class="loading">
        <img src="@/assets/img/img-loading.png" alt="" />
      </div>
    </div>
    <p class="ver-txt">v1.0</p>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  layout: 'none',
  methods: {
    haveAllPermission() {
      //TODO: 위치, 마이크, 블루투스 권한
      console.log('저는 위치, 마이크, 블루투스 권한을 가지고 있습니다.');
      return false;
    },
    havePushPermission() {
      //TODO : 체크하기
      console.log('저는 푸시 권한을 가지고 있습니다.');
      return false;
    },
  },
  mounted() {
    setTimeout(() => {
      if (!this.haveAllPermission()) {
        this.$router.replace('/intro/permission');
      }
      if (!this.havePushPermission()) {
        this.$router.replace('/intro/push');
      }
      this.$router.replace('/login');
    }, 1000);
  },
};
</script>
