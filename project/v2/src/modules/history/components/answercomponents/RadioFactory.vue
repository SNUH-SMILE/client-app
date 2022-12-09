<template>
  <div class="cr-list" :class="{ half: isEvenLabels }">
    <v-radio
      v-for="(label, index) in question.labels"
      :key="label"
      :name="question.order"
      :label="label"
      :value="value"
      :checked="value === getPoints[index]"
      :point="getPoints[index]"
      @input="handleInput"
    ></v-radio>
  </div>
</template>
<script>
import VRadio from '@/components/common/VRadio.vue';
const DEFAULT_POINTS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
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
    getPoints() {
      return this.question.points ? this.question.points : DEFAULT_POINTS;
    },
  },
  methods: {
    handleInput(value) {
      this.$emit('input', value);
    },
  },
};
</script>
