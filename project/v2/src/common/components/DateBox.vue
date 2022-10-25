<template>
  <div class="date-box">
    <button type="button" class="btn-prev">
      <span class="txt-blind">전 일</span>
    </button>
    <span class="date">{{ date }}</span>
    <button type="button" class="btn-next">
      <span class="txt-blind">후 일</span>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    date: {
      type: String,
      default: '',
    },
  },
};
</script>

<style></style>
