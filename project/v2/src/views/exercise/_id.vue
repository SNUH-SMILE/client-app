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
              <span class="txtc-blue fw-500">명상/요가/스트레칭</span>
              <span class="time">22분</span>
            </p>
            <p class="ttl">거북목 탈출 일자목 운동 거북목 탈출 일자목 운동 거북목 탈출 일자목 운동</p>
          </div>
          <div class="ds-box">
            거북목을 교정하는 스트레칭입니다. 거북목을 교정하는 스트레칭입니다. 거북목을 교정하는 스트레칭입니다. 거북목을 교정하는 스트레칭입니다.
            거북목을 교정하는 스트레칭입니다.거북목을 교정하는 스트레칭입니다. 거북목을 교정하는 스트레칭입니다. 거북목을 교정하는 스트레칭입니다.
            거북목을 교정하는 스트레칭입니다. 거북목을 교정하는 스트레칭입니다.
          </div>
        </div>
      </div>
    </div>
    <div class="btn-wrap ratio-1-1">
      <router-link custom v-slot="{ navigate }" :to="{ name: 'exercise-setting' }">
        <button type="button" class="btn-line navy" @click="navigate">운동 알림 설정</button>
      </router-link>
      <button type="button" class="btn-txt navy" @click="popup = 'data-alert'">지금시작</button>
    </div>
    <mobile-data-alert v-if="poppu === 'data-alert'" />
  </div>
</template>
<route>
{
  "meta": {
    "title": "운동 상세"
  }
}
</route>
<script>
const INIT_STATE = () => ({});

export default {
  data() {
    return {
      state: INIT_STATE(),
      popup: '',
    };
  },
};
</script>

<style></style>
