<template>
  <div class="content-wrap">
    <div class="content">
      <date-box :value="date" @change="onChangeDate" />
      <!-- :value="date" @change="handleValue" -->
      <div class="cont-inner mb-space20 tb-space20">
        <app-medicine-notice-list />

        <app-medicine-time-list />
      </div>
    </div>
    <div class="btn-wrap">
      <router-link custom v-slot="{ navigate }" :to="{ name: 'medicine-check', query: { requestDate: date } }">
        <button type="button" class="btn-txt navy" @click="navigate">복약 체크하기</button>
      </router-link>
    </div>
  </div>
</template>

<route>
{
  "meta": {
    "title": "복약 관리"
  }
}
</route>
<script>
import DateBox from '@/common/components/DateBox.vue';
import { mapActions, mapGetters } from 'vuex';
import { MEDICINE_NOTICE_LIST, MEDICINE_TIMELINE_LIST } from '@/modules/medicine';
import AppMedicineNoticeList from '@/modules/medicine/AppMedicineNoticeList.vue';
import AppMedicineTimeList from '@/modules/medicine/AppMedicineTimeList.vue';

export default {
  components: {
    DateBox,
    AppMedicineNoticeList,
    AppMedicineTimeList,
  },
  data() {
    return {
      date: this.$dayjs().format('YYYYMMDD'),
    };
  },
  created() {
    this.fetchNoticeList(this.date);
    this.fetchTimeLineList(this.date);
  },
  computed: {
    ...mapGetters({ noticeList: MEDICINE_NOTICE_LIST }),
  },
  methods: {
    ...mapActions({ fetchNoticeList: MEDICINE_NOTICE_LIST, fetchTimeLineList: MEDICINE_TIMELINE_LIST }),
    onChangeDate(newDate) {
      this.date = newDate;
      this.fetchNoticeList(this.date);
      this.fetchTimeLineList(this.date);
    },
  },
};
</script>

<style></style>
