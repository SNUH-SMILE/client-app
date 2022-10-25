<template>
  <div class="form-item">
    <validation-provider mode="passive" :name="index" :rules="question.answerRequired" tag="fragment" v-slot="{ errors }">
      <label class="form-ttl">{{ index }}. {{ question.question }}</label>
      <component :is="question.answerType" :question="question" :value="value" @input="handleInput" />
      <span>{{ errors[0] }}</span>
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
    },
  },
};
</script>
