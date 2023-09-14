<template>
  <modal-layout title="비밀번호 확인">
    <template slot="body">
      <p class="pop-txt">비밀번호를 입력해주세요.</p>
      <div class="ipt-wrap">
        <input id="passworkd" type="password" v-model="password" />
      </div>
    </template>
    <template slot="foot">
      <div class="btn-wrap">
        <button type="button" class="btn-txt blue" @click="$emit('onSubmit', password)">확인</button>
        <button type="button" class="btn-txt white" @click="$emit('onClose')">취소</button>
      </div>
    </template>
  </modal-layout>
</template>

<script>
export default {
  data() {
    return {
      password: '',
    };
  },
};
</script>

<style></style>
