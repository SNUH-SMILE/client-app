<template>
  <div class="form-item">
    <label :for="id" class="form-ttl">{{ label }}</label>
    <div class="ipt-wrap" :class="{ disabled }">
      <textarea
        v-if="type === 'textarea'"
        :value="value"
        ref="input"
        v-on="getListeners"
        v-bind="getInputProps"
        @input="handleInput"
        :maxlength="maxlength"
      />
      <input v-else ref="input" :value="value" v-on="getListeners" v-bind="getInputProps" @input="handleInput" />
      <span v-if="unit" class="unit">{{ unit }}</span>
      <button type="button" v-if="reset" class="btn-txt-reset" @click="resetInput">
        <span class="txt-blind">입력 초기화</span>
      </button>
      <slot></slot>
    </div>
    <slot name="noti"></slot>
  </div>
</template>
<script>
export default {
  name: 'text-field',
  props: {
    value: {
      type: String,
      default: '',
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
    maxlength: {
      type: Number,
      default: 500,
    },
    inputProps: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    getListeners() {
      /* eslint no-unused-vars: "off" */
      const { input, ...others } = this.$listeners;
      return { ...others };
    },
    getInputProps() {
      const { value, reset, unit, inputProps, ...others } = this.$props;
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
