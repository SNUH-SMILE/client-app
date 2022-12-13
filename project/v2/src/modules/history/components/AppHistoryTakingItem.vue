<template>
  <div class="form-item" :hidden="isHidden">
    <validation-provider :name="index + '번'" immediate :rules="question.answerRequired" tag="fragment">
      <label class="form-ttl" v-html="`${index}. ${question.question}`"></label>
      <component :is="question.answerType" :question="question" :value="value" @input="handleInput" />
    </validation-provider>
  </div>
</template>
<script>
import { CheckboxFactory, RadioFactory, InputFactory, RadioCalendar, PointFactory } from '@/modules/history/components/answercomponents';
import DatePicker from '@/common/components/DatePicker.vue';
export default {
  props: {
    value: null,
    index: Number,
    question: Object,
  },
  data() {
    return {
      isHidden: true,
    };
  },
  created() {
    if (Object.prototype.hasOwnProperty.call(this.question, 'parent')) {
      this.isHidden = this.question.answerRequired !== 'required';
    } else {
      this.isHidden = false;
    }
  },
  components: { CheckboxFactory, RadioFactory, InputFactory, RadioCalendar, PointFactory, DatePicker },
  methods: {
    handleInput(value) {
      this.$emit('input', value);
      if (this.question?.child) {
        this.$eventBus.$emit('changeRequired', this.question.order);
      }
    },
  },
  computed: {},
  watch: {
    question: {
      deep: true,
      handler(newValue) {
        if (Object.prototype.hasOwnProperty.call(newValue, 'parent')) {
          this.isHidden = newValue.answerRequired !== 'required';
        } else {
          this.isHidden = false;
        }
      },
    },
  },
};
</script>
