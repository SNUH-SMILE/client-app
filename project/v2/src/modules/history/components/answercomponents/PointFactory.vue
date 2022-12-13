<template>
  <div class="cr-list" :class="{ half: isEvenLabels }">
    <app-history-radio
      v-for="(label, index) in question.labels"
      :key="question.order + label"
      :id="`${question.order}-${getPoints[index]}`"
      :value="value"
      :name="question.order"
      :label="label"
      :point="getPoints[index]"
      :checked="value === getPoints[index]"
      @input="handleInput"
    />
  </div>
</template>
<script>
import AppHistoryRadio from '@/modules/history/components/AppHistoryRadio.vue';
export default {
  name: 'point-factory',
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
      return this.question.points ? this.question.points : ['0', '1', '2', '3', '4'];
    },
  },
  methods: {
    handleInput: function (value) {
      this.$emit('input', value);
    },
  },
};
</script>
