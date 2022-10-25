<template>
  <modal-layout title="문진 작성 알림">
    <template slot="body">
      <p class="pop-txt ic-write">
        작성하지 않은 문진이 있습니다.
        <br />시간 내에 반드시 작성해주세요.
      </p>
    </template>
    <template slot="foot">
      <div class="btn-wrap">
        <button type="button" class="btn-txt white" @click="$emit('onAction', 'close')">다음에 작성하기</button>
        <button type="button" class="btn-txt blue" @click="$emit('onAction', 'submit')">지금 작성하기</button>
      </div>
    </template>
  </modal-layout>
</template>

<script>
export default {};
</script>
