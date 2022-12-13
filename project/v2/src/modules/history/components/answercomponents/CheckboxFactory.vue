<template>
  <div class="cr-list" :class="{ half: isEvenLabels }">
    <app-history-check-box
      v-for="(label, index) in question.labels"
      :key="label"
      :name="label"
      :label="label"
      :point="getPoints[index]"
      :id="`${question.order}-${getPoints[index]}`"
      :checked="value.includes(getPoints[index])"
      :value="value"
      @input="handleInput"
    />
  </div>
</template>
<script>
import AppHistoryCheckBox from '@/modules/history/components/AppHistoryCheckBox.vue';
const DEFAULT_POINTS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
export default {
  name: 'checkbox-factory',
  components: {
    AppHistoryCheckBox,
  },
  props: {
    value: {
      type: Array,
      required: true,
    },
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
  mounted() {},
};
</script>
