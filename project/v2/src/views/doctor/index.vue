발<template>
  <div class="content-wrap">
    <div class="content">
      <div class="gray-top-box center">
        <p class="bold fs-16">2022.01.03</p>
      </div>
      <div class="cont-inner mb-space20">
        <section>
          <h2 class="fs-15 mb10">비대면 진료 접수 상태</h2>
          <!-- 진료 없음 -->
          <div class="diagnosis-box" v-if="diagnosisState == 0">
            <strong class="ttl ic-d-no">진료 없음</strong>
            <p class="sub-txt">오늘은 예약된 진료가 없습니다.</p>
          </div>

          <!-- 진료 대기중 -->
          <div class="diagnosis-box" v-else-if="diagnosisState == 1">
            <strong class="ttl ic-d-ing">진료 대기중</strong>
            <p class="sub-txt"><strong class="fs-18">14:30</strong>에 예약된 진료가 있습니다.</p>
          </div>

          <!-- 진료 종료 -->
          <div class="diagnosis-box" v-else-if="diagnosisState == 2">
            <strong class="ttl ic-d-end">진료 종료</strong>
            <p class="sub-txt">오늘의 진료는 종료 되었습니다.</p>
          </div>
        </section>
      </div>
    </div>
    <div class="btn-wrap">
      <router-link custom v-slot="{ navigate }" :to="{ name: '' }">
        <button type="button" class="btn-txt navy" @click="navigate" :disabled="!(diagnosisState == 1)">진료실 입장하기</button>
      </router-link>
    </div>
  </div>
</template>
<route>
{
  "meta": {
    "title": "비대면 진료"
  }
}
</route>
<script>
const INIT_STATE = () => ({});

export default {
  data() {
    return {
      state: INIT_STATE(),
      diagnosisState: 0,
    };
  },
  components: {},
};
</script>

<style></style>
