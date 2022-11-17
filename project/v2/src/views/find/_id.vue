<template>
  <div class="content-wrap">
    <validation-observer tag="fragment">
      <div class="content">
        <div class="cont-inner">
          <div class="img-info-box img-id">
            <p class="img-info-txt">
              김하나님의 <br class="tb-none" />아이디는 <br /><em class="iht txtc-blue">{{ state.loginId }}</em
              >입니다.
            </p>
            <div class="center">
              <router-link custom v-slot="{ navigate }" :to="{ name: 'find' }">
                <button type="button" class="btn-link" @click="navigate">비밀번호 찾기</button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="btn-wrap">
        <router-link custom v-slot="{ navigate }" :to="{ name: 'login' }" replace>
          <button type="button" class="btn-txt navy" @click="navigate">로그인</button>
        </router-link>
      </div>
    </validation-observer>
  </div>
</template>

<script>
const INIT_STATE = () => ({
  loginId: '',
});

export default {
  layout: 'none',
  data() {
    return {
      state: INIT_STATE(),
    };
  },
  props: {
    id: {
      type: String,
    },
  },
  created() {
    this.state.loginId = this.$router.history.current.params.id;
  },
};
</script>

<style></style>
