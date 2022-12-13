<template>
  <modal-layout title="앱 PUSH 알림 동의" bodyClass="pb0">
    <template slot="body">
      <p class="pop-txt">자가격리 APP의 PUSH 알림을 <br />받으시겠습니까?</p>
      <div class="gray-info-box">
        <ul class="dot-list">
          <li>수신에 동의하시면 자가격리 APP에서 제공하는 각종 서비스에 대한 알림을 받아보실 수 있습니다.</li>
        </ul>
      </div>
    </template>
    <template slot="foot">
      <div class="btn-wrap">
        <router-link custom v-slot="{ navigate }" to="/intro/push-reject" replace>
          <button type="button" class="btn-txt white" @click="navigate">거부</button>
        </router-link>
        <router-link custom v-slot="{ navigate }" to="/intro/push-agree" replace>
          <button type="button" class="btn-txt blue" @click="navigate">수신</button>
        </router-link>
      </div>
    </template>
  </modal-layout>
</template>
<script>
// import { getPushPermissionService } from '@/services/native/push.js';
export default {
  layout: 'none',
  methods: {},
  created() {},
  beforeRouteLeave(to, from, next) {
    if (to.name === 'intro-push-agree') {
      // getPushPermissionService();
    }
    next();
  },
};
</script>

<style></style>
