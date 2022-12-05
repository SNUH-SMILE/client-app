<template>
  <div>
    <div class="hbox sc">
      <p class="ipt-rdo">
        <!-- TODO : checked 조건 수정하기 -->
        <input type="radio" :checked="value !== '없음'" title="날짜 직접입력" :name="question.order" value="" />
      </p>
      <DatePicker :onlyCalendar="false" :value="value" @input="handleData" />
    </div>
    <p class="ipt-rdo mt20">
      <input type="radio" :checked="value === '없음'" :name="question.order" value="없음" @change="handleValue" />
      <label :for="question.order">없음</label>
    </p>
  </div>
</template>

<script>
import DatePicker from '@/common/components/DatePicker.vue';
export default {
  name: 'radio-calendar',
  components: {
    DatePicker,
  },
  props: {
    value: String,
    question: Object,
  },
  data() {
    return {
      date: '',
    };
  },
  computed: {
    getAttrs() {
      /* eslint no-unused-vars: "off" */
      const { label, id, name, value, key, ...others } = this.$attrs;
      return others;
    },
    getListeners() {
      /* eslint no-unused-vars: "off" */
      const { input, ...others } = this.$listeners;
      return { ...others };
    },
  },
  methods: {
    handleValue(e) {
      this.$emit('input', e.target.value);
    },
    handleData(data) {
      this.$emit('input', data);
    },
  },
};
</script>

<style></style>
