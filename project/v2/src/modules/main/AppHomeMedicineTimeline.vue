<template>
  <section class="section-box">
    <div class="section-ttl-box">
      <h2 class="section-ttl">복약 타임라인</h2>
    </div>
    <!-- yesdata -->
    <div class="info-center-box" v-if="list.length > 0" style="max-height: 17rem">
      <ul class="time-line-list" style="width: 100%; overflow-y: auto">
        <li class="item" v-for="item in list" :key="`home-medicine-time-line-${item.drugDoseSeq}`" style="padding: 1rem 0">
          <span class="time" style="width: 4rem">{{ item.timeLabel }}</span>
          <div class="medicine-info" v-if="!item.noticeName">
            <span class="ttl">{{ item.drugList[0].drugName }}</span>
            <span class="txt">{{ item.drugList[0].drugCount }} {{ item.drugList[0].drugTypeLabel }}</span>
          </div>
          <div class="medicine-info" v-else>
            <strong class="ttl" v-if="item.noticeName">{{ item.noticeName }}</strong>
            <p class="sub" v-for="(drug, index) in item.drugList" :key="`home-drug-item-${item.drugDoseSeq}-${index}`">
              <span class="ttl">{{ drug.drugName }}</span>
              <span class="txt">{{ drug.drugCount }} {{ drug.drugTypeLabel }}</span>
            </p>
          </div>
        </li>
      </ul>
    </div>
    <!-- nodata -->
    <div class="nodata-box" v-else>
      <p class="ic-txt pill">금일 복약 내역이 없습니다.</p>
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { MEDICINE_TIMELINE_LIST } from '../medicine';
export default {
  activated() {
    this.fetchTimeLineList(this.$dayjs().format('YYYYMMDD'));
  },
  computed: {
    ...mapGetters({ list: MEDICINE_TIMELINE_LIST }),
  },
  methods: {
    ...mapActions({ fetchTimeLineList: MEDICINE_TIMELINE_LIST }),
  },
};
</script>

<style></style>
