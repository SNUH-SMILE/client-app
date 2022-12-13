<template>
  <div :class="classSelector">
    <app-history-text-field
      v-for="(answer, index) in question.answers"
      :key="question.order + index"
      :type="answer.type"
      :unit="answer.unit ? answer.unit : ''"
      :name="question.order"
      :onlyInput="classSelector === 'ipt-wrap'"
      :value="question.value"
      @input="handleInput"
    />
    <span v-if="classSelector === 'ipt-wrap' && question.answers[0].unit ? true : false" class="unit">{{ question.answers[0].unit }}</span>
  </div>
</template>
<script>
import AppHistoryTextField from '@/modules/history/components/AppHistoryTextField.vue';
export default {
  name: 'radio-factory',
  components: { AppHistoryTextField },
  props: {
    value: null,
    question: Object,
  },
  computed: {
    classSelector() {
      if (this.question.answers.length === 1) {
        return 'ipt-wrap';
      } else if (this.question.answers.length % 2 === 0) {
        return 'hbox';
      }
      return '';
    },
  },
  methods: {
    handleInput(value) {
      this.$emit('input', value);
    },
  },
};
</script>
