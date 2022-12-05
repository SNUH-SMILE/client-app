<template>
  <p class="ipt-chk">
    <input
      type="checkbox"
      v-on="getListeners"
      v-bind="getInputProps"
      :value="label"
      :checked="value.includes(label)"
      @change="onChange"
      @input="handleChange"
      ref="input"
    />
    <label :for="id">{{ label }}</label>
    <slot></slot>
    <slot name="noti"></slot>
  </p>
</template>
<script>
export default {
  name: 'v-check-box',
  inheritAttrs: false,
  props: {
    value: {
      type: Array,
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
  },
  watch: {},
  methods: {
    handleInput(e) {
      this.$emit('input', e.target.value);
    },
    onChange(e) {
      let currentValue = [...this.value];
      if (e.target.checked) {
        currentValue.push(e.target.value);
      } else {
        currentValue = currentValue.filter((item) => item !== e.target.value);
      }
      this.$emit('input', currentValue);
    },
    handleChange(e) {
      console.log(e.target.value);
    },
  },
  created() {
    // console.log(this.$refs.input);
  },
};
</script>
