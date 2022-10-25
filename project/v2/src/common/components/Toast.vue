<template>
  <transition name="fade" appear="">
    <div class="toast-wrap show">
      <div class="toast-txt">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
export default {};
</script>

<style></style>
