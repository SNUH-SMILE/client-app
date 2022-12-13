<template>
  <fragment>
    <div class="content-wrap">
      <div class="content">
        <app-medicine-check-list @refetch="refetch" />
      </div>
      <div class="btn-wrap">
        <router-link custom v-slot="{ navigate }" :to="{ name: 'medicine-no-alarm-check' }">
          <button type="button" class="btn-txt navy" @click="navigate">알림없이 체크하기</button>
        </router-link>
      </div>
    </div>
    <!-- <toast text="복약 체크되었습니다." btmClass="is-btm" v-show="toastShow" /> -->
  </fragment>
</template>

<route>
{
  "meta": {
    "title":"복약 체크하기"
  }
}
</route>
<script>
import Vue from 'vue';
import AppMedicineCheckList from '@/modules/medicine/AppMedicineCheckList.vue';
import { mapActions } from 'vuex';
import { MEDICINE_NOTICE_LIST } from '@/modules/medicine';

export default {
  beforeRouteEnter(to, from, next) {
    if (!to.query.requestDate) {
      Vue.$alert('잘못된 접근입니다.');
      next({ name: 'medicine' });
    } else {
      next();
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'medicine' && this.once) {
      to.query.requestDate = this.$route.query.requestDate;
      this.once = false;
      return next({ name: 'medicine', query: { requestDate: this.$route.query.requestDate } });
    }
    next();
  },
  components: { AppMedicineCheckList },
  data() {
    return {
      once: true,
    };
  },
  created() {
    this.fetchList(this.$route.query.requestDate);
  },
  methods: {
    ...mapActions({ fetchList: MEDICINE_NOTICE_LIST }),
    refetch() {
      this.fetchList(this.$route.query.requestDate);
    },
  },
};
</script>

<style></style>
