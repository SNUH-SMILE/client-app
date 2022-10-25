<template>
  <div class="content-wrap">
    <div class="content">
      <div class="cont-inner mb-space20">
        <div class="center-box pt120">
          <div class="ic-info-txt check">문진을 작성하고 <br />나에게 꼭 맞는 운동을 추천 받으세요.</div>
        </div>
      </div>
    </div>
    <div class="btn-wrap">
      <router-link custom v-slot="{ navigate }" :to="{ name: 'history-taking' }">
        <button type="button" class="btn-txt navy" @click="navigate">문진하기</button>
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
