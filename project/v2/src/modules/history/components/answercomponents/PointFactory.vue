<template>
  <div class="cr-list" :class="{ half: isEvenLabels }">
    <v-radio
      v-for="(label, index) in question.labels"
      :key="question.order + label"
      :id="`${question.order}-${getPoints[index]}`"
      :value="value"
      :name="question.order"
      :label="label"
      :point="getPoints[index]"
      :checked="value === getPoints[index]"
      @input="handleInput"
    ></v-radio>
  </div>
</template>
<script>
import VRadio from '@/components/common/VRadio.vue';
export default {
  name: 'point-factory',
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
