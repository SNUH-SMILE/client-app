<template>
  <div class="content-wrap">
    <div class="content">
      <div class="cont-inner pt0 tb-w100p">
        <ul class="md-set-list">
          <li>
            <div class="hbox jc">
              <p class="ttl">{{ detail.title }}</p>
            </div>
          </li>
          <li>
            <div class="hbox jc">
              <p class="ttl">알람 시간</p>
              <div class="right-area">
                <button type="button" class="btn-txt-detail" @click="popup = 'time'">{{ time }}</button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="btn-wrap">
      <button type="button" class="btn-txt navy" @click="onSubmit">저장</button>
    </div>
    <app-time-picker v-if="popup === 'time'" v-model="time" @onClose="popup = ''" />
  </div>
</template>
<route>
{
    "meta" : {
        "title" : "운동하기"
    }
}
</route>
<script>
import AppTimePicker from '@/components/AppTimePicker.vue';
import { mapGetters, mapMutations } from 'vuex';
import { EXERCISE_DETAIL } from '@/modules/exercise';
import Vue from 'vue';
const INIT_STATE = () => ({});

export default {
  components: { AppTimePicker },
  data() {
    return {
      state: INIT_STATE(),
      time: '12:30',
      popup: '',
    };
  },
  beforeRouteEnter(to, from, next) {
    if (!to.params.id) {
      Vue.$alert('잘못된 접근입니다.');
      next({ name: 'exercise' });
    } else {
      next();
    }
  },
  created() {
    this.fetchDetail(this.$route.params.id);
  },
  computed: {
    ...mapGetters({ detail: EXERCISE_DETAIL }),
  },
  methods: {
    ...mapMutations({ fetchDetail: EXERCISE_DETAIL }),
    onSubmit() {
      this.$toast('알림 설정 내용이 저장되었습니다.');
      // this.$router.back();
    },
  },
};
</script>

<style></style>
