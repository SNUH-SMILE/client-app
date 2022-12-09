<template>
  <div class="progress-wrap">
    <div class="progress-box">
      <!-- 진행률에 따라 width 값을 변경해주세요. -->
      <transition appear @before-enter="beforeStart" @after-enter="start">
        <div class="bar" ref="transition"></div>
      </transition>
    </div>
    <div class="txt">STEP {{ ing }}/{{ total }}</div>
  </div>
</template>

<script>
export default {
  name: 'v-step-progress',
  data() {
    return {
      percent: 10,
    };
  },
  props: {
    ing: {
      type: Number,
      default: 1,
    },
    total: {
      type: Number,
      default: 2,
    },
  },
  watch: {
    ing: function (newValue) {
      this.percent = parseInt((newValue / this.total) * 100);
      this.$refs.transition.style.width = `${this.percent}%`;
      this.$refs.transition.style.transition = `width 1s linear`;
    },
  },
  methods: {
    beforeStart(el) {
      el.style.width = 0;
    },
    start(el) {
      el.style.width = `${this.percent}%`;
      el.style.transition = `width 1s linear`;
    },
  },
};
</script>

<style></style>
