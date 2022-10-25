<template>
  <div class="cr-list" :class="{ half: isEvenLabels }">
    <v-radio
      v-for="label in question.labels"
      :key="question.order + label"
      :id="question.order"
      :name="question.order"
      :label="label"
      @input="handleInput"
    ></v-radio>
  </div>
</template>
<script>
import VRadio from '@/components/common/VRadio.vue';
export default {
  // TODO value == 포인트로 처리할 것
  // points 가 있으면 points 로 없으면 0,1,2,3,4.. 길이 만큼.
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
    handleInput: function (e) {
      this.$emit('input', e.target.value);
    },
  },
};
</script>
