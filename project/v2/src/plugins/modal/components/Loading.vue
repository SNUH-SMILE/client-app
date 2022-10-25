<template>
  <transition name="fade" appear v-if="show">
    <div class="loading-wrap show">
      <div class="loading">
        <img src="@/assets/img/img-loading.png" alt="" />
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  data() {
    return {
      show: true,
    };
  },
};
</script>
