<template>
  <li>
    <button type="button" @click="$emit('click')">
      <span class="title-box" :class="{ isNew }">
        <pre class="ttl" :class="{ ellipsis: !showContent }">{{ title }}</pre>
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
    showContent: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style></style>
