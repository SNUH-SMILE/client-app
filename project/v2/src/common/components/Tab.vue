<template>
  <div class="tab-box">
    <ul class="tab" :class="scrollClass">
      <li v-for="(tab, index) in tabs" :key="index" :class="{ selected: currentTab === index }">
        <button type="button" @click="currentTab = index">{{ tab }}</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    tabs: Array,
    scrollClass: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      currentTab: 0,
    };
  },
};
</script>

<style></style>
