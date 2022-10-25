<template>
  <p class="ipt-chk">
    <input type="checkbox" :name="name" :id="id" :value="value" />
    <label :for="id">{{ label }}</label>
  </p>
</template>
<script>
export default {
  name: 'checkbox',
  props: {
    value: {
      type: Boolean,
    },
    name: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: '',
    },
  },
};
</script>
