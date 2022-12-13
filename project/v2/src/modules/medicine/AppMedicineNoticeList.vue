<template>
  <section class="section-box02">
    <h2 class="ttl-b">
      알림
      <router-link custom v-slot="{ navigate }" :to="{ name: 'medicine-setting' }">
        <button type="button" class="btn-line-rnd small" @click="navigate">알림 추가</button>
      </router-link>
    </h2>

    <!-- yesdata -->
    <ul class="alarm-list line-box" v-if="list.length">
      <li v-for="item in list" :key="`notice-alarm-${item.drugAlarmSeq}`">
        <span class="ttl">{{ item.noticeName }}</span>
        <span class="txt">{{ item.noticeTimeLabel }}</span>
      </li>
    </ul>

    <!-- nodata -->
    <div class="nodata-box h-medium" v-else>
      <p>알림을 추가하고 약 드시는 것 잊지 마세요!</p>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import { MEDICINE_NOTICE_LIST } from '.';
export default {
  computed: {
    ...mapGetters({ list: MEDICINE_NOTICE_LIST }),
  },
};
</script>

<style></style>
