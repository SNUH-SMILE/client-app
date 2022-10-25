<template>
  <div class="content-wrap">
    <div class="content">
      <div class="cont-inner pt0 tb-w100p">
        <ul class="md-set-list">
          <li>
            <div class="hbox jc">
              <p class="ttl">거북목 탈출 일자목 운동</p>
            </div>
          </li>
          <li>
            <div class="hbox jc">
              <p class="ttl">알람 시간</p>
              <div class="right-area">
                <button type="button" class="btn-txt-detail" @click="showModal">09:00</button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="btn-wrap">
      <router-link custom v-slot="{ navigate }" :to="{ name: 'exercise-detail' }">
        <button type="button" class="btn-txt navy" @click="navigate">저장</button>
      </router-link>
    </div>
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
const INIT_STATE = () => ({});

export default {
  components: {},
  data() {
    return {
      state: INIT_STATE(),
      toastShow: false,
      toastMessage: '알림 설정 내용이 저장되었습니다.',
    };
  },
  methods: {
    showModal() {
      this.$eventBus.$emit('openTimePicker');
    },
    showToast() {
      this.$toast({ text: this.toastMessage });
    },
  },
};
</script>

<style></style>
