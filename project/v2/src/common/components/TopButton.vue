<template>
  <button type="button" class="btn-top" @click="moveTopScroll">
    <span class="txt-blind">맨위로</span>
  </button>
</template>
<script>
export default {
  methods: {
    moveTopScroll() {
      document.querySelector('.content').scrollTop = 0;
    },
  },
};
</script>
