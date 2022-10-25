<template>
  <div class="form-item">
    <label v-if="label" :for="id" class="form-ttl">{{ label }}</label>
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    id: {
      type: String,
      default: '',
    },
  },
};
</script>
