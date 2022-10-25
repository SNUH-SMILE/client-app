<template>
  <p class="ipt-rdo">
    <input type="radio" :name="name" :id="id" />
    <label :for="id">{{ label }}</label>
  </p>
</template>
<script>
export default {
  name: 'radio',
  props: {
    value: {
      type: String,
      default: '',
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
