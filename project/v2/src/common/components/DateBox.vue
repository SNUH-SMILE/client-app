<template>
  <div class="date-box">
    <button type="button" class="btn-prev" @click="prev()">
      <span class="txt-blind">전 일</span>
    </button>
    <span class="date">{{ date.substring(2, 4) }}.{{ date.substring(4, 6) }}.{{ date.substring(6, 8) }}</span>
    <button type="button" class="btn-next" @click="next()">
      <span class="txt-blind">후 일</span>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
    },
  },
  data() {
    return {
      date: this.value,
    };
  },
  methods: {
    next() {
      if (this.date !== this.$dayjs().format('YYYYMMDD')) {
        this.date = this.$dayjs(this.date, 'YYYYMMDD').add(1, 'day').format('YYYYMMDD');
        this.$emit('change', this.date);
      }
    },
    prev() {
      this.date = this.$dayjs(this.date, 'YYYYMMDD').subtract(1, 'day').format('YYYYMMDD');
      this.$emit('change', this.date);
    },
  },
  created() {},
};
</script>

<style></style>
