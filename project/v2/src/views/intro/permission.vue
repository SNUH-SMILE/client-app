<template>
  <modal-layout title="앱 접근 권한 동의" @onSubmit="next">
    <template slot="body">
      <p class="pop-txt pt0">자가격리 APP 사용시 <br />다음 권한이 필요합니다.</p>
      <ul class="ic-list">
        <li class="ic-list-item mic"><span class="ttl">마이크</span>비대면 진료 시 사용</li>
        <li class="ic-list-item location"><span class="ttl">위치</span>격리 이탈 여부 판단 시 사용</li>
        <li class="ic-list-item bluetooth"><span class="ttl">블루투스</span>기기 연결 시 사용</li>
      </ul>
    </template>
  </modal-layout>
</template>
<script>
// import { getCurrendLocation, getMikePermission, getBluetoothPermission } from '@/services/native/permission.js';
export default {
  layout: 'none',
  methods: {
    next() {
      // const locationPermission = getCurrendLocation();
      // const mikePermission = getMikePermission();
      // const bluetoothPermission = getBluetoothPermission();
      // if (locationPermission && mikePermission && bluetoothPermission === true) {
      //   console.log('true');
      //   this.$router.replace('/intro/push');
      // } else {
      // 권한을 허용하지 않으면 어떻게 처리할지.
      // }
    },
  },
  created() {},
};
</script>

<style></style>
