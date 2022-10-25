<template>
  <div class="ipt-wrap">
    <input type="text" title="날짜입력" :value="value" @input="handleInput" />
    <date-picker type="date"></date-picker>
    <button type="button" class="btn-calendar">
      <span class="txt-blind">날짜선택</span>
    </button>
  </div>
</template>
<script>
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
const INIT_STATE = () => ({
  date: '',
});
export default {
  name: 'v-date-picker',
  components: { DatePicker },
  props: {
    value: String,
    label: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '날짜입력',
    },
  },
  data() {
    return {
      state: INIT_STATE(),
    };
  },
  computed: {},
  methods: {
    handleInput: function (e) {
      this.$emit('input', e.target.value);
    },
  },
};
</script>
