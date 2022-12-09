<template>
  <div class="content-wrap">
    <div class="content">
      <div class="cont-inner mb-space20">
        <div class="center-box pt120">
          <div class="ic-info-txt rest">
            문진 결과 운동보다는 휴식을 추천 드립니다.
            <br />충분히 몸을 회복시켜주세요.
          </div>
        </div>
      </div>
    </div>
    <div class="btn-wrap">
      <router-link custom v-slot="{ navigate }" :to="{ name: 'home' }" replace>
        <button type="button" class="btn-txt navy" @click="navigate">돌아가기</button>
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
  data() {
    return {
      state: INIT_STATE(),
    };
  },
};
</script>

<style></style>
