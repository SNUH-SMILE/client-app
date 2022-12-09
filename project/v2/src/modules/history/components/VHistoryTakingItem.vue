<template>
  <div class="form-item" :hidden="isHidden">
    <validation-provider :name="index + '번'" immediate :rules="question.answerRequired" tag="fragment">
      <label class="form-ttl">
        <pre>{{ index }}. {{ question.question }}</pre>
      </label>
      <component :is="question.answerType" :question="question" :value="value" @input="handleInput" />
    </validation-provider>
  </div>
</template>
<script>
import AnswerComponents from '@/modules/history/components/answercomponents';
export default {
  props: {
    value: null,
    index: Number,
    question: Object,
  },
  data() {
    return {};
  },
  components: { ...AnswerComponents },
  methods: {
    handleInput(value) {
      this.$emit('input', value);
      if (this.question?.child) {
        this.$eventBus.$emit('changeRequired', this.question.order);
      }
    },
  },
  computed: {
    isHidden() {
      if (Object.prototype.hasOwnProperty.call(this.question, 'parent')) {
        return this.question.answerRequired !== 'required';
      } else {
        return false;
      }
    },
  },
};
</script>
