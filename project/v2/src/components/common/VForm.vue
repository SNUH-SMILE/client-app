<template>
  <div class="form-box" :class="{ 'tb-half': half }"><slot></slot></div>
</template>
<script>
export default {
  props: {
    half: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
