<template>
  <div class="content-wrap">
    <div class="content tb-h100p">
      <!-- mobile -->
      <div class="cont-inner pt0 tb-none" v-show="isMobile">
        <app-support-notice-list @selectedItem="openDetail" />
      </div>
      <!-- tablet -->
      <div class="half-cont-inner mb-none" v-show="!isMobile">
        <div class="left-area scroll-y">
          <app-support-notice-list @selectedItem="onClickItem" />
        </div>
        <div class="right-area scroll-y">
          <app-notice-detail
            v-if="selectedItem"
            :title="selectedItem.noticeTitle"
            :content="selectedItem.noticeBody"
            :date="selectedItem.noticeDateLabel"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<route>
{
  "meta": {
    "title": "공지사항"
  }
}
</route>
<script>
import AppSupportNoticeList from '@/modules/etc/AppSupportNoticeList.vue';
import { mapState } from 'vuex';
import AppNoticeDetail from '@/components/AppNoticeDetail.vue';
// import NoticeList from '@/modules/etc/NoticeList.vue';

export default {
  data() {
    return {
      selectedItem: null,
    };
  },
  components: {
    AppSupportNoticeList,
    AppNoticeDetail,
  },
  computed: {
    ...mapState({
      isMobile: 'isMobile',
    }),
  },
  methods: {
    onClickItem(item) {
      this.selectedItem = item;
    },
    openDetail(item) {
      console.log(item);
      this.$router.push({
        name: 'customer-notice-id',
        params: { detail: item },
      });
    },
  },
};
</script>

<style></style>
