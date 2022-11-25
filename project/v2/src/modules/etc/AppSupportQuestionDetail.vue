<template>
  <fragment>
    <div class="noti-top">
      <p class="ttl">{{ title }}</p>
      <span class="date">등록 일자: {{ date }}</span>
    </div>
    <div class="noti-btm">
      <div class="pre-box">{{ content }}</div>
    </div>
    <div class="answer-box">
      <!-- yesdata -->
      <div v-if="isAnswer">
        <div class="noti-top">
          <p class="ttl txtc-blue">[답변]{{ answerTitle }}</p>
          <span class="date">등록 일자: {{ answerDate }}</span>
        </div>
        <div class="noti-btm">
          <div class="pre-box">{{ answerContent }}</div>
        </div>
      </div>
      <!-- nodata -->
      <div class="nodata-box" v-else>
        <p>아직 답변이 등록되지 않았습니다.</p>
      </div>
    </div>
  </fragment>
</template>

<script>
export default {
  props: ['title', 'content', 'date', 'answerTitle', 'answerDate', 'answerContent'],
  computed: {
    isAnswer() {
      return this.answerTitle && this.answerContent;
    },
  },
};
</script>

<style></style>
