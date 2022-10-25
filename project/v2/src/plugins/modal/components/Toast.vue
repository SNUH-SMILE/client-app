<template>
  <transition name="fade" appear v-if="show">
    <div class="toast-wrap show">
      <div class="toast-txt" v-html="content"></div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      content: '',
      show: true,
    };
  },
};
</script>

<style></style>
