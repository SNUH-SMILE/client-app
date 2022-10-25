<template>
  <div class="cr-list" :class="{ half: isEvenLabels }">
    <v-checkbox v-for="label in question.labels" :key="label" :id="label" :name="label" :label="label" :value="value" @input="handleInput" />
  </div>
</template>
<script>
import VCheckbox from '@/components/common/VCheckBox.vue';
export default {
  name: 'checkbox-factory',
  components: {
    VCheckbox,
  },
  props: {
    value: {
      type: Array,
      required: true,
    },
    question: Object,
  },
  // created() {
  //   console.log(this.labels);
  // },
  computed: {
    isEvenLabels: function () {
      return this.question.labels.length % 2 == 0;
    },
  },
  methods: {
    handleInput(value) {
      this.$emit('input', value);
      console.log(value);
    },
  },
};
</script>
