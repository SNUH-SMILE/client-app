<template>
  <div class="content-wrap">
    <div class="content">
      <div class="cont-inner mb-pt0 tb-full tb-divide">
        <div class="img-box">
          <img src="https://cphoto.asiae.co.kr/listimglink/6/2019080807215588068_1565216515.jpg" alt="" />
        </div>
        <div class="ex-info-wrap">
          <div class="info-box">
            <p class="divide-list">
              <span class="txtc-blue fw-500">{{ detail.exerciseTitle }}</span>
              <span class="time">{{ detail.runningMin }}분</span>
            </p>
            <p class="ttl">{{ detail.title }}</p>
          </div>
          <div class="ds-box" v-html="descHtml"></div>
        </div>
      </div>
    </div>
    <div class="btn-wrap ratio-1-1">
      <router-link custom v-slot="{ navigate }" :to="{ name: 'exercise-setting', params: { id: detail.videoId } }">
        <button type="button" class="btn-line navy" @click="navigate">운동 알림 설정</button>
      </router-link>
      <button type="button" class="btn-txt navy" @click="startVideo">지금시작</button>
    </div>
    <app-mobile-data-alert v-if="popup === 'data-alert'" @onClose="popup = ''" @onStart="onStart" />
  </div>
</template>

<script>
import AppMobileDataAlert from '@/modules/exercise/AppMobileDataAlert.vue';
import { mapGetters, mapMutations } from 'vuex';
import { EXERCISE_DETAIL } from '.';
import { STORAGE_DATA } from '@/native/data';
import { STORAGE_KEYS } from '@/common/constants';
export default {
  components: { AppMobileDataAlert },
  props: ['videoId'],
  data() {
    return {
      popup: '',
    };
  },
  created() {
    try {
      this.fetchDetail(this.videoId);
    } catch (e) {
      this.$alert('동영상 정보를 찾을 수 없습니다.');
      console.error(e);
    }
  },
  computed: {
    ...mapGetters({ detail: EXERCISE_DETAIL }),
    descHtml() {
      if (this.detail.desc) return this.detail.desc.replace('\n', '<br/>');
      return '';
    },
  },
  methods: {
    ...mapMutations({ fetchDetail: EXERCISE_DETAIL }),
    startVideo() {
      const noShowAgain = this.$nativeScript(STORAGE_DATA, STORAGE_KEYS.MOBILE_DATA_ALERT_YN);
      if (noShowAgain === 'Y') {
        this.$router.push({
          name: 'exercise-video',
          params: {
            video: this.detail,
          },
        });
      } else {
        this.popup = 'data-alert';
      }
    },
    onStart(noShowAgain) {
      if (noShowAgain) this.$nativeScript(STORAGE_DATA, STORAGE_KEYS.MOBILE_DATA_ALERT_YN, 'Y');
      this.popup = '';
      this.$router.push({
        name: 'exercise-video',
        params: {
          video: this.detail,
        },
      });
    },
  },
};
</script>

<style></style>
