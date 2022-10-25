<template>
  <div class="content-wrap">
    <div class="content">
      <div class="cont-inner">
        <h1 class="ttl-m mb-space30">가지고 계신 기기를 <br /><span class="txtc-blue">연결</span>해 주세요.</h1>
        <ul class="btn-line-list">
          <li>
            <button type="button" @click="popup = 'garmin'">가민 기기 연결하기</button>
          </li>
          <li>
            <router-link custom v-slot="{ navigate }" :to="{ name: 'device-list' }">
              <button type="button" @click="navigate">다른 기기 연결하기</button>
            </router-link>
          </li>
        </ul>
        <div class="center mt120">
          <router-link custom v-slot="{ navigate }" :to="{ name: 'device-help' }">
            <button type="button" class="btn-info" @click="navigate">가민 기기 연결 도움말</button>
          </router-link>
        </div>
      </div>
    </div>

    <div class="btn-wrap">
      <router-link custom v-slot="{ navigate }" :to="{ name: 'home' }" replace>
        <button type="button" class="btn-txt navy" @click="navigate">다음에 연결하기</button>
      </router-link>
    </div>
    <garmin-connect v-if="popup === 'garmin'" @onClose="popup = ''" />
  </div>
</template>

<route>
{
  "meta": {
    "title": "기기 연결하기"
  }
}
</route>
<script>
import GarminConnect from '@/components/GarminConnect.vue';
const INIT_STATE = () => ({});

export default {
  components: {
    GarminConnect,
  },
  data() {
    return {
      state: INIT_STATE(),
      popup: '',
    };
  },
};
</script>

<style></style>
