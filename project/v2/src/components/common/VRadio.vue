<template>
  <p class="ipt-rdo">
    <input type="radio" v-on="getListeners" v-bind="getInputProps" :value="setValue" :checked="checked" @input="handleInput" ref="input" />
    <label :for="id">{{ label }}</label>
  </p>
</template>
<script>
export default {
  name: 'v-radio',
  inheritAttrs: false,
  props: {
    value: {
      type: null,
    },
    label: {
      type: String,
    },
    id: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
    },
    inputProps: {
      type: Object,
      default() {
        return {};
      },
    },
    name: {
      type: String,
      default: '',
    },
    checked: {
      type: Boolean,
    },
    point: {
      type: String,
      default: undefined,
    },
  },
  computed: {
    getListeners() {
      /* eslint no-unused-vars: "off" */
      const { input, ...others } = this.$listeners;
      return { ...others };
    },
    getInputProps() {
      const { value, label, inputProps, ...others } = this.$props;
      return { ...inputProps, ...others };
    },
    setValue() {
      return this.point ? this.point : this.label;
    },
  },
  methods: {
    handleInput(e) {
      this.$emit('input', e.target.value);
    },
  },
};
</script>
