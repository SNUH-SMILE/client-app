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
import dayjs from 'dayjs';
import { REGIST_LOCAL_ALARM, SYNC_LOCAL_ALARM } from '@/native/alarm';
import { ENUM_ALARM_TYPE, ENUM_DATE_FORMAT } from '@/common/constants';
const INIT_STATE = () => ({});

const getCloseTime = () => {
  let today = dayjs();
  const minute = today.minute();
  let min = 0;
  if (minute < 50) {
    min = (Math.floor(minute / 10) + 1) * 10;
  } else {
    today = today.add(1, 'hour');
  }
  today = today.minute(min);
  return today.format('HH:mm');
};

export default {
  components: { AppTimePicker },
  data() {
    return {
      state: INIT_STATE(),
      time: getCloseTime(),
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
  beforeRouteLeave(to, from, next) {
    if (this.popup) {
      this.popup = '';
      next(false);
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
    async onSubmit() {
      // console.log(this.detail, this.time);
      const time = Number(this.time.replace(':', ''));
      const currentTime = Number(this.$dayjs().format(ENUM_DATE_FORMAT.Hm));
      if (time < currentTime) {
        return this.$alert('알림 시간은 현재 시간 이후여야 합니다.');
      }

      const { videoId, title: body } = this.detail;
      await this.$nativeScript(
        REGIST_LOCAL_ALARM,
        videoId,
        '운동 예약하신 시간입니다. 지금 시작해볼까요?',
        body,
        ENUM_ALARM_TYPE.EXERCISE,
        `${this.$dayjs().format(ENUM_DATE_FORMAT.HyphenYmd)} ${this.time}:00`,
        {
          action: ENUM_ALARM_TYPE.EXERCISE,
          videoId: videoId,
        }
      );
      this.$nativeScript(SYNC_LOCAL_ALARM);
      this.$toast('알림 설정 내용이 저장되었습니다.');
      this.$router.back();
    },
  },
  watch: {
    time(newValue) {},
  },
};
</script>

<style></style>
