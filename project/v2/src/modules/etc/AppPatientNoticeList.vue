<template>
  <app-notice-list class="tb-icon-none">
    <app-notice-item
      v-for="(item, index) in list"
      @click="onClickItem(item, index)"
      :key="`patient-notice-${index}`"
      :ref="`item${index}`"
      :title="item.noticeBody"
      :date="item.noticeDateLabel"
      :showContent="selectedItem === item"
    />
  </app-notice-list>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import AppNoticeList from '@/components/AppNoticeList.vue';
import AppNoticeItem from './AppPatientNoticeItem.vue';
import { PATIENT_NOTICE_LIST } from '@/modules/etc';

export default {
  components: { AppNoticeList, AppNoticeItem },
  data() {
    return {
      selectedItem: null,
    };
  },
  async created() {
    await this.fetchList();
  },
  computed: {
    ...mapGetters({
      list: PATIENT_NOTICE_LIST,
    }),
  },

  methods: {
    ...mapActions({
      fetchList: PATIENT_NOTICE_LIST,
    }),
    onClickItem(item, index) {
      this.selectedItem = this.selectedItem === item ? null : item;
      const $target = this.$refs[`item${index}`];
      if ($target[0].$el) {
        this.$nextTick(() => {
          setTimeout(() => {
            $target[0].$el.scrollIntoView({ block: 'start', behavior: 'smooth' });
          }, 100);
        });
      }
    },
  },
};
</script>
