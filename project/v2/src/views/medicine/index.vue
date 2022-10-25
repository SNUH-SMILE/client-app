<template>
  <div class="content-wrap">
    <div class="content">
      <date-box date="22.07.05" />
      <div class="cont-inner mb-space20 tb-space20">
        <section class="section-box02">
          <h2 class="ttl-b">
            알림
            <router-link custom v-slot="{ navigate }" :to="{ name: 'medicine-check' }">
              <button type="button" class="btn-line-rnd small" @click="navigate">알림 추가</button>
            </router-link>
          </h2>
          <!-- nodata -->
          <div class="nodata-box h-medium" v-if="!alarmShow">
            <p>알림을 추가하고 약 드시는 것 잊지 마세요!</p>
          </div>

          <!-- yesdata -->
          <ul class="alarm-list line-box" v-if="alarmShow">
            <li v-for="item in alarmList" :key="item.index">
              <span class="ttl">{{ item.title }}</span>
              <span class="txt">{{ item.time }}</span>
            </li>
          </ul>
        </section>
        <section class="section-box02">
          <h2 class="ttl-b">복약 타임라인</h2>
          <!-- nodata -->
          <div class="nodata-box h-medium" v-if="!timeLineShow">
            <p>복약 정보가 없습니다.</p>
          </div>

          <!-- yesdata -->
          <ul class="time-line-list line-box" v-if="timeLineShow">
            <li class="item" v-for="item in historyList" :key="item.index">
              <span class="time">{{ item.time }}</span>
              <div class="medicine-info">
                <strong class="ttl">{{ item.title }}</strong>
                <span class="txt" v-if="!item.subData">{{ item.medicine }} 알</span>
                <p class="sub" v-for="subData in item.subData" :key="subData.index">
                  <span class="ttl">{{ subData.title }}</span>
                  <span class="txt">{{ subData.medicine }} 알</span>
                </p>
              </div>
            </li>
          </ul>
        </section>
      </div>
    </div>
    <div class="btn-wrap">
      <router-link custom v-slot="{ navigate }" :to="{ name: 'medicine-check' }">
        <button type="button" class="btn-txt navy" @click="navigate">복약 체크하기</button>
      </router-link>
    </div>
  </div>
</template>

<route>
{
  "meta": {
    "title": "복약 관리"
  }
}
</route>
<script>
import DateBox from '@/common/components/DateBox.vue';

const INIT_STATE = () => ({});

export default {
  data() {
    return {
      state: INIT_STATE(),
      alarmShow: false, //알림
      timeLineShow: false, //복약 타임라인
      alarmList: [
        {
          title: '진통제',
          time: '09:00',
        },
        {
          title: '점심약',
          time: '11:00',
        },
      ],
      historyList: [
        {
          time: '09 : 56',
          title: '타이레놀',
          medicine: 1,
        },
        {
          time: '14 : 00',
          title: '점심약',
          subData: [
            {
              title: '소염진통제',
              medicine: 1,
            },
          ],
        },
        {
          time: '16 : 56',
          title: '타이레놀',
          medicine: 1,
        },
        {
          time: '18 : 00',
          title: '저녁약',
          subData: [
            {
              title: '소염진통제',
              medicine: 1,
            },
            {
              title: '소화제',
              medicine: 2,
            },
          ],
        },
      ],
    };
  },
  components: {
    DateBox,
  },
};
</script>

<style></style>
