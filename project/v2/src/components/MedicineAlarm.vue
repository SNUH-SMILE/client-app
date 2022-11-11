<template>
  <li>
    <p class="sub-ttl">알림 1</p>
    <div class="right-area">
      <button type="button" class="btn-txt-detail" @click="showTimePicker = true">{{ time.substring(0, 2) }}:{{ time.substring(3, 5) }}</button>
    </div>
    <time-picker v-if="showTimePicker" v-model="time" @onClose="showTimePicker = false" @onSubmit="handleValue" />
  </li>
</template>
<script>
import TimePicker from '@/components/TimePicker.vue';
export default {
  name: 'medicine-alarm',
  components: {
    TimePicker,
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
      time: '',
    };
  },
  methods: {
    handleValue(value) {
      this.time = value;
      this.$emit('input', value);
    },
  },
  created() {
    this.time = this.value;
  },
};
</script>
