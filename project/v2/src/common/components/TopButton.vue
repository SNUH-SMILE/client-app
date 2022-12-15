<template>
  <button type="button" class="btn-top" @click="moveTopScroll">
    <span class="txt-blind">맨위로</span>
  </button>
</template>
<script>
export default {
  methods: {
    moveTopScroll() {
      const elContent = document.querySelector('.content');
      const elContentWrap = document.querySelector('.content-wrap');
      if (elContent) elContent.scrollTop = 0;
      if (elContentWrap) elContentWrap.scrollTop = 0;
    },
  },
};
</script>
