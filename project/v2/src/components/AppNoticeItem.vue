<template>
  <li>
    <button type="button" @click="$emit('click')">
      <span class="title-box" :class="{ isNew }">
        <span class="ttl" :class="{ ellipsis }">{{ title }}</span>
        <em class="badge">N</em>
      </span>
      <span class="sub-box">
        <span class="date">{{ date }}</span>
      </span>
    </button>
  </li>
</template>

<script>
export default {
  props: {
    isNew: {
      type: Boolean,
      default: false,
    },
    ellipsis: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: '',
    },
    date: {
      type: String,
      default: '',
    },
  },
};
</script>

<style></style>
