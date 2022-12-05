<template>
  <div :class="onlyCalendar ? 'cr-list' : ''">
    <date-picker :value="getValue" @input="handleDataPicker" format="YYYY-MM-DD" :type="type" :range="range">
      <!-- -->
      <i slot="icon-calendar">
        <button type="button" class="btn-calendar">
          <span class="txt-blind">날짜선택</span>
        </button>
      </i>
    </date-picker>
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
    onlyCalendar: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      default: 'date',
    },
    range: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      state: INIT_STATE(),
    };
  },
  computed: {
    getValue() {
      return new Date(this.value);
    },
  },
  methods: {
    handleInput: function (e) {
      this.$emit('input', e.target.value);
    },
    handleDataPicker: function (value) {
      const stringValue = this.$dayjs(value).format('YYYY-MM-DD');
      this.$emit('input', stringValue);
    },
  },
};
</script>
