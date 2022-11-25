<template>
  <app-notice-list>
    <app-notice-item
      v-for="(item, index) in list"
      @click="onClickItem(item)"
      :key="`sup-notice-${index}`"
      :title="item.noticeTitle"
      :date="item.noticeDateLabel"
    />
  </app-notice-list>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import AppNoticeList from '@/components/AppNoticeList.vue';
import AppNoticeItem from '@/components/AppNoticeItem.vue';
import { NOTICE_LIST } from '@/modules/etc';

export default {
  components: { AppNoticeList, AppNoticeItem },
  async created() {
    await this.fetchList();
  },
  computed: {
    ...mapGetters({
      list: NOTICE_LIST,
    }),
  },

  methods: {
    ...mapActions({
      fetchList: NOTICE_LIST,
    }),
    onClickItem(item) {
      console.log(item);
      this.$emit('selectedItem', item);
    },
  },
};
</script>
