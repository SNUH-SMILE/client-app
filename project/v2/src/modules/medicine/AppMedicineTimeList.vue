<template>
  <section class="section-box02">
    <h2 class="ttl-b">복약 타임라인</h2>

    <!-- yesdata -->
    <ul class="time-line-list line-box" v-if="list.length > 0">
      <li class="item" v-for="item in list" :key="`medicine-time-line-${item.drugDoseSeq}`">
        <span class="time">{{ item.timeLabel }}</span>
        <div class="medicine-info" v-if="!item.noticeName">
          <span class="ttl">{{ item.drugList[0].drugName }}</span>
          <span class="txt">{{ item.drugList[0].drugCount }} {{ item.drugList[0].drugTypeLabel }}</span>
        </div>
        <div class="medicine-info" v-else>
          <strong class="ttl" v-if="item.noticeName">{{ item.noticeName }}</strong>
          <p class="sub" v-for="(drug, index) in item.drugList" :key="`drug-item-${item.drugDoseSeq}-${index}`">
            <span class="ttl">{{ drug.drugName }}</span>
            <span class="txt">{{ drug.drugCount }} {{ drug.drugTypeLabel }}</span>
          </p>
        </div>
      </li>
    </ul>

    <!-- nodata -->
    <div class="nodata-box h-medium" v-else>
      <p>복약 정보가 없습니다.</p>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import { MEDICINE_TIMELINE_LIST } from '.';
export default {
  computed: {
    ...mapGetters({ list: MEDICINE_TIMELINE_LIST }),
  },
};
</script>

<style></style>
