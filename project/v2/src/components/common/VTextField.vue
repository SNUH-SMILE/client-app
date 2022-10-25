<template>
  <div class="ipt-wrap" :class="{ disabled }" v-if="!onlyInput">
    <textarea v-if="type === 'textarea'" ref="input" v-on="getListeners" v-bind="getInputProps" @input="handleInput" />
    <input v-else ref="input" v-on="getListeners" v-bind="getInputProps" @input="handleInput" />
    <span v-if="unit" class="unit">{{ unit }}</span>
    <button type="button" v-if="reset" class="btn-txt-reset" @click="resetInput">
      <span class="txt-blind">입력 초기화</span>
    </button>
    <slot></slot>
  </div>
  <textarea v-else-if="type === 'textarea'" ref="input" v-on="getListeners" v-bind="getInputProps" @input="handleInput" />
  <input v-else ref="input" v-on="getListeners" v-bind="getInputProps" @input="handleInput" />
</template>
<script>
export default {
  name: 'v-text-field',
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
    label: {
      type: String,
      default: '',
    },
    id: {
      type: String,
      default: '',
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
      const { value, reset, unit, label, inputProps, ...others } = this.$props;
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
