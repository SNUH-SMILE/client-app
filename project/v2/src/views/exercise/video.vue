<template>
  <div class="content-wrap">
    <div class="content" style="height: 100%">
      <div class="cont-inner pd0 tb-full" style="height: 100%">
        <youtube width="100%" height="100%" :video-id="videoId" :player-vars="playerVars" @playing="playing"></youtube>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
const INIT_STATE = () => ({});

export default {
  beforeRouteEnter(to, from, next) {
    if (!to.params.video) {
      Vue.$alert('잘못된 접근입니다.');
      return next({ name: 'exercise' });
    }
    to.meta.title = to.params.video.title;
    next();
  },
  data() {
    return {
      videoId: this.$route.params.video.youtubeId,
      playerVars: {
        autoplay: 1,
      },
    };
  },
  methods: {
    playing() {
      // console.log('\o/ we are watching!!!');
    },
  },
};
</script>

<style></style>
