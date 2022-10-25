<template>
  <div class="content-wrap">
    <validation-observer tag="fragment">
      <div class="content">
        <div class="tab-box">
          <ul class="tab">
            <li v-for="(tab, index) in tabs" :key="index" :class="{ selected: currentTab === index }">
              <button type="button" @click="currentTab = index">{{ tab }}</button>
            </li>
          </ul>
        </div>
        <div class="cont-inner mb-space30">
          <!-- 아이디 찾기 -->
          <div class="form-box" v-show="currentTab == 0">
            <validation-provider name="성명" rules="required" immediate tag="fragment">
              <text-field id="name" label="성명" v-model="state.name" />
            </validation-provider>
            <validation-provider name="휴대폰 번호" rules="required" immediate tag="fragment">
              <text-field id="phone" type="tel" label="휴대폰 번호" placeholder="(-)구분 없이 입력" v-model="state.phone" />
            </validation-provider>
          </div>

          <!-- 비밀번호 찾기 -->
          <div class="form-box" v-show="currentTab == 1">
            <validation-provider name="아이디" rules="required" immediate tag="fragment">
              <text-field id="id" label="아이디" v-model="state.id" />
            </validation-provider>
            <validation-provider name="성명" rules="required" immediate tag="fragment">
              <text-field id="name" label="성명" v-model="state.name" />
            </validation-provider>
            <validation-provider name="휴대폰 번호" rules="required" immediate tag="fragment">
              <text-field id="phone" type="tel" label="휴대폰 번호" placeholder="(-)구분 없이 입력" v-model="state.phone" />
            </validation-provider>
          </div>
        </div>
      </div>

      <!-- 아이디 찾기 -->
      <div class="btn-wrap" v-show="currentTab == 0">
        <router-link custom v-slot="{ navigate }" :to="{ name: 'find-id' }">
          <button type="button" class="btn-txt navy" @click="navigate">아이디 찾기</button>
        </router-link>
      </div>

      <!-- 비밀번호 찾기 -->
      <div class="btn-wrap" v-show="currentTab == 1">
        <router-link custom v-slot="{ navigate }" :to="{ name: 'find-pw' }">
          <button type="button" class="btn-txt navy" @click="navigate">비밀번호 재설정</button>
        </router-link>
      </div>
    </validation-observer>
  </div>
</template>
<route>
{
  "meta": {
    "title": "아이디 / 비밀번호 찾기"
  }
}
</route>
<script>
const INIT_STATE = () => ({
  id: '',
  name: '',
  phone: '',
});

export default {
  data() {
    return {
      state: INIT_STATE(),
      currentTab: 0,
      tabs: ['아이디 찾기', '비빌번호 찾기'],
    };
  },
};
</script>

<style></style>
