<template>
  <modal-layout title="모바일 데이터">
    <template slot="body">
      <p class="pop-txt">
        Wifi에 연결하지 않고 LTE/5G 이용 시
        <br />데이터 요금이 부과될 수 있습니다. <br /><br />재생 하시겠습니까?
      </p>
    </template>
    <template slot="foot">
      <div class="btn-wrap">
        <button type="button" class="btn-txt white" @click="$emit('onClose')">재생취소</button>
        <button type="button" class="btn-txt blue" @click="$emit('onStart', noShowAgain)">재생하기</button>
      </div>
    </template>
    <template slot="noti">
      <p class="ipt-chk-noti">
        <input type="checkbox" id="chk01" v-model="noShowAgain" />
        <label for="chk01">다시 표시 안함</label>
      </p>
    </template>
  </modal-layout>
</template>

<script>
export default {
  data() {
    return {
      noShowAgain: false,
    };
  },
};
</script>

<style></style>
