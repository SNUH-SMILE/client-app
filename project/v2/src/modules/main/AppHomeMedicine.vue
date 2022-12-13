<template>
  <section class="section-box">
    <div class="section-ttl-box">
      <h2 class="section-ttl">복약관리</h2>
      <router-link custom v-slot="{ navigate }" :to="{ name: 'medicine' }">
        <button type="button" class="btn-ic-txt arrow" @click="navigate">바로가기</button>
      </router-link>
    </div>
    <!-- yesdata -->
    <div class="info-center-box" v-if="content">
      <p class="txt-info">
        <strong class="ic-txt pill">{{ content.noticeTimeLabel }}</strong
        >에 드실 약이 있습니다.
      </p>
      <strong class="sub-txt">&ldquo; {{ content.noticeName }} &rdquo;</strong>
    </div>
    <!-- nodata -->
    <div class="nodata-box" v-else>
      <p class="ic-txt pill">설정된 복약 알림이 없습니다.</p>
    </div>
  </section>
</template>

<script>
import { ENUM_DATE_FORMAT } from '@/common/constants';
import { mapActions, mapGetters } from 'vuex';
import { MEDICINE_NOTICE_LIST, MEDICINE_NOTICE_LIST_BY_TIME } from '../medicine';
export default {
  created() {
    this.fetchList(this.$dayjs().format(ENUM_DATE_FORMAT.YMD));
  },
  computed: {
    ...mapGetters({ list: MEDICINE_NOTICE_LIST_BY_TIME }),
    content() {
      if (this.list.length > 0) {
        const currentTime = this.$dayjs().format(ENUM_DATE_FORMAT.Hm);
        const list = this.list.filter(({ time }) => currentTime < time);
        if (list.length > 0) {
          return list[0].contents[0];
        }
      }
      return null;
    },
  },
  methods: {
    ...mapActions({ fetchList: MEDICINE_NOTICE_LIST }),
  },
};
</script>

<style></style>
