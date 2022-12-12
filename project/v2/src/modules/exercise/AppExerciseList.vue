<template>
  <div class="cont-inner mb-space20 tb-space20">
    <section class="section-box02" v-for="exercise in list" :key="`exercise-list-${exercise.exerciseId}`">
      <h2 class="ttl-b">{{ exercise.exerciseTitle }}</h2>
      <ul class="video-list">
        <li v-for="video in exercise.contents" :key="`video-${video.videoId}`">
          <router-link custom v-slot="{ navigate }" :to="{ name: 'exercise-id', params: { id: video.videoId } }">
            <button type="button" @click="navigate">
              <span class="thumbnail-box">
                <img src="https://src.hidoc.co.kr/image/lib/2021/1/26/1611634006093_0.jpg" alt="" />
                <span class="time">{{ video.runningMin }}분</span>
              </span>
              <span class="ttl">
                <em class="ellipsis2">{{ video.title }}</em></span
              >
            </button>
          </router-link>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { EXERCISE_LIST } from '.';
export default {
  created() {
    this.getList();
  },
  computed: {
    ...mapGetters({ list: EXERCISE_LIST }),
  },
  methods: {
    ...mapMutations({ getList: EXERCISE_LIST }),
  },
};
</script>

<style></style>
