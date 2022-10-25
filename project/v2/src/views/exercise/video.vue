<template>
  <div class="content-wrap">
    <validation-observer tag="fragment">
      <div class="content">
        <div class="cont-inner pd0 tb-full"></div>
      </div>
    </validation-observer>
  </div>
</template>

<script>
const INIT_STATE = () => ({});

export default {
  beforeRouteEnter(to, from, next) {
    to.meta.title = 'override!';
    next();
  },
  components: {},
  data() {
    return {
      state: INIT_STATE(),
    };
  },
};
</script>

<style></style>
