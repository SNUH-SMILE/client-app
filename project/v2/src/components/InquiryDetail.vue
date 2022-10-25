<template>
  <fragment>
    <div class="noti-top">
      <p class="ttl">자가 격리 물품은 어떻게 받을 수 있나요? 자가 격리 물품은 어떻게 받을 수 있나요?</p>
      <span class="date">등록 일자: 2022.01.01</span>
    </div>
    <div class="noti-btm">
      <div class="pre-box">센터에서 배부하는 물품은 문 앞에 놓아 주시나요? 궁금합니다.</div>
    </div>
    <div class="answer-box">
      <!-- nodata -->
      <div class="nodata-box" v-if="!answerShow">
        <p>아직 답변이 등록되지 않았습니다.</p>
      </div>
      <!-- yesdata -->
      <div v-else>
        <div class="noti-top">
          <p class="ttl txtc-blue">[답변]자가 격리 물품 배부 방법</p>
          <span class="date">등록 일자: 2022.01.01</span>
        </div>
        <div class="noti-btm">
          <div class="pre-box">네. 문 앞에 놓아드립니다.</div>
        </div>
      </div>
    </div>
  </fragment>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      answerShow: true,
    };
  },
};
</script>

<style></style>
