<template>
  <div :class="{ 'header-wrap': showUser }">
    <header class="header" :class="{ 'no-line': !headerLine }">
      <h1 class="hd-ttl">{{ headerTitle }}</h1>
      <button v-if="headerType === 'back'" type="button" class="btn-hd back" @click="$router.go(-1)">
        <span class="txt-blind">뒤로가기</span>
      </button>
      <button v-else-if="headerType === 'close'" type="button" class="btn-hd close" @click="$router.go(-1)">
        <span class="txt-blind">닫기</span>
      </button>
      <template v-else-if="headerType === 'nav'">
        <router-link custom v-slot="{ navigate }" :to="{ name: 'device' }">
          <button type="button" class="btn-hd bluetooth" @click="navigate">
            <span class="txt-blind">기기연결</span>
          </button>
        </router-link>
        <router-link custom v-slot="{ navigate }" :to="{ name: 'alarm' }">
          <button type="button" class="btn-hd alarm" :class="{ new: newAlram }" @click="navigate">
            <span class="txt-blind">알림함</span>
          </button>
        </router-link>
        <router-link custom v-slot="{ navigate }" :to="{ name: 'customer' }">
          <button type="button" class="btn-hd customer" @click="navigate">
            <span class="txt-blind">고객지원</span>
          </button>
        </router-link>
      </template>
    </header>
    <user-info v-if="showUser" />
  </div>
</template>
<script>
import UserInfo from '@/components/UserInfo.vue';
import { mainService } from '@/services/api';
import { mapGetters } from 'vuex';
import { LOGIN_ID } from '@/modules/patient';
import { RESPONSE_STATUS } from '@/common/constants';
export default {
  name: 'default-header',
  components: {
    UserInfo,
  },
  data() {
    return {
      title: '',
      newAlram: false,
    };
  },
  computed: {
    ...mapGetters({ loginId: LOGIN_ID }),
    headerLine() {
      return this.$route.meta.headerLine;
    },
    headerType() {
      return this.$route.meta.headerType;
    },
    headerTitle() {
      // console.log(this.$route.meta.title);
      return this.$route.meta.title;
    },
    showUser() {
      return this.headerType === 'nav';
    },
  },
  watch: {
    async $route(to, from) {
      if (to.name === 'home') {
        const { code, message, data } = await mainService.mainNotice(this.loginId);
        if (code === RESPONSE_STATUS.SUCCESS) {
          this.newAlram = data.existYn === 'Y';
        }
      }
    },
  },
};
</script>

<style></style>
