<template>
  <div class="cr-list" :class="{ half: isEvenLabels }">
    <app-history-radio
      v-for="(label, index) in question.labels"
      :key="label"
      :name="question.order"
      :label="label"
      :value="value"
      :id="`${question.order}-${getPoints[index]}`"
      :checked="value === getPoints[index]"
      :point="getPoints[index]"
      @input="handleInput"
    />
  </div>
</template>
<script>
import AppHistoryRadio from '@/modules/history/components/AppHistoryRadio.vue';
const DEFAULT_POINTS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
export default {
  name: 'radio-factory',
  components: {
    AppHistoryRadio,
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
