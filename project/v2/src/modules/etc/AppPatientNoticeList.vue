<template>
  <app-notice-list class="tb-icon-none">
    <app-notice-item
      v-for="(item, index) in list"
      @click="onClickItem(item)"
      :key="`patient-notice-${index}`"
      :title="item.noticeBody"
      :date="item.noticeDateLabel"
    />
  </app-notice-list>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import AppNoticeList from '@/components/AppNoticeList.vue';
import AppNoticeItem from '@/components/AppNoticeItem.vue';
import { PATIENT_NOTICE_LIST } from '@/modules/etc';

export default {
  components: { AppNoticeList, AppNoticeItem },
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
    onClickItem(item) {
      this.$emit('selectedItem', item);
    },
  },
};
</script>
