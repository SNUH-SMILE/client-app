<template>
  <div>
    <div class="hbox sc">
      <p class="ipt-rdo">
        <input type="radio" title="날짜 직접입력" :name="question.order" />
      </p>
      <div class="ipt-wrap">
        <input type="text" title="날짜입력" />
        <button type="button" class="btn-calendar">
          <span class="txt-blind">날짜선택</span>
        </button>
      </div>
    </div>
    <p class="ipt-rdo mt20">
      <input type="radio" :name="question.order" />
      <label :for="question.order">없음</label>
    </p>
  </div>
</template>

<script>
export default {
  name: 'radio-calendar',
  components: {},
  props: {
    value: String,
    question: Object,
  },
  computed: {
    getAttrs() {
      /* eslint no-unused-vars: "off" */
      const { label, id, name, value, key, ...others } = this.$attrs;
      return others;
    },
    getListeners() {
      /* eslint no-unused-vars: "off" */
      const { input, ...others } = this.$listeners;
      return { ...others };
    },
  },
};
</script>

<style></style>
