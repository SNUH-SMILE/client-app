<template>
  <div class="cr-list" :class="{ half: isEvenLabels }">
    <v-radio v-for="label in question.labels" :key="label" :name="question.order" :label="label" :value="label" @input="handleInput"></v-radio>
  </div>
</template>
<script>
import VRadio from '@/components/common/VRadio.vue';
export default {
  name: 'radio-factory',
  components: {
    VRadio,
  },
  props: {
    value: String,
    question: Object,
  },
  computed: {
    isEvenLabels: function () {
      return this.question.labels.length % 2 == 0;
    },
  },
  methods: {
    handleInput(value) {
      this.$emit('input', value);
    },
  },
};
</script>
