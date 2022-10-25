<template>
  <p class="ipt-rdo-switch" :class="{ disabled: disabled }">
    <input type="radio" ref="input1" :id="ids[0]" v-on="getListeners" v-bind="getInputProps" @input="handleInput" />
    <label :for="ids[0]">{{ labels[1] }}</label>
    <input type="radio" ref="input2" :id="ids[1]" v-on="getListeners" v-bind="getInputProps" @input="handleInput" />
    <label :for="ids[1]">{{ labels[2] }}</label>
  </p>
</template>

<script>
export default {
  name: 'v-switch',
  inheritAttrs: false,
  props: {
    value: {
      type: String,
      default: '',
    },
    onlyInput: {
      type: Boolean,
      default: false,
    },
    labels: {
      type: Array,
      default() {
        return [];
      },
    },
    ids: {
      type: Array,
      default() {
        return [];
      },
    },
    type: {
      type: String,
      default: 'text',
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
    reset: {
      type: Boolean,
      default: false,
    },
    unit: {
      type: String,
      default: '',
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
      const { value, labels, ids, inputProps, ...others } = this.$props;
      return { ...inputProps, ...others };
    },
  },
  methods: {
    handleInput(e) {
      this.$emit('input', e.target.value);
    },
    resetInput() {
      this.$refs.input.value = '';
      this.$emit('input', '');
    },
  },
};
</script>
