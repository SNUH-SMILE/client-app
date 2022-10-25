<template>
  <div :class="classSelector">
    <v-text-field
      v-for="(answer, index) in question.answers"
      :key="question.order + index"
      :type="answer.type"
      :unit="answer.unit ? answer.unit : ''"
      :name="question.order"
      :onlyInput="classSelector === 'ipt-wrap'"
      :value="value"
      @input="handleInput"
    ></v-text-field>
    <span v-if="classSelector === 'ipt-wrap' && question.answers[0].unit ? true : false" class="unit">{{ question.answers[0].unit }}</span>
  </div>
</template>
<script>
import VTextField from '@/components/common/VTextField.vue';
export default {
  name: 'radio-factory',
  components: { VTextField },
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
