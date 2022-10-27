<template>
  <div class="date-box">
    <button type="button" class="btn-prev" @click="prev()">
      <span class="txt-blind">전 일</span>
    </button>
    <span class="date">{{ date }}</span>
    <button type="button" class="btn-next" @click="next()">
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
  methods: {
    prev() {
      this.$emit('prev');
    },
    next() {
      this.$emit('next');
    },
  },
};
</script>

<style></style>
