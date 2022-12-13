<template>
  <li>
    <p class="sub-ttl"><slot></slot></p>
    <div class="right-area">
      <button type="button" class="btn-txt-detail" @click="showTimePicker = true">{{ value }}</button>
    </div>
    <app-time-picker v-if="showTimePicker" :value="value" @input="handleInput" @onClose="showTimePicker = false" />
  </li>
</template>
<script>
import AppTimePicker from '@/components/AppTimePicker.vue';
export default {
  name: 'medicine-alarm',
  components: {
    AppTimePicker,
  },
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showTimePicker: false,
    };
  },
  methods: {
    handleInput(newValue) {
      this.$emit('input', newValue);
    },
  },
};
</script>
