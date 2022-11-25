<template>
  <fragment>
    <div class="noti-top">
      <p class="ttl">{{ title }}</p>
      <span class="date">등록 일자: {{ date }}</span>
    </div>
    <div class="noti-btm">
      <div class="pre-box">{{ content }}</div>
    </div>
  </fragment>
</template>

<script>
export default {
  props: ['title', 'date', 'content'],
};
</script>

<style></style>
