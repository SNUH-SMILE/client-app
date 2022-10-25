<template>
  <div class="content-wrap">
    <div class="content tb-h100p">
      <!-- mobile -->
      <div class="cont-inner pt0 tb-none" v-show="isMobile">
        <notice-list :notiList="notiList" textClass="ellipsis" />
      </div>
      <!-- tablet -->
      <div class="half-cont-inner mb-none" v-show="!isMobile">
        <div class="left-area scroll-y">
          <notice-list :notiList="notiList" textClass="ellipsis" />
        </div>
        <div class="right-area scroll-y">
          <notice-detail />
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
import { mapState } from 'vuex';
import NoticeList from '@/components/NoticeList.vue';
import NoticeDetail from '@/components/NoticeDetail.vue';

const INIT_STATE = () => ({});

export default {
  data() {
    return {
      state: INIT_STATE(),
      notiList: [
        {
          title: '[생활치료센터]자가 격리 물품 배부 안내',
          date: '2022.04.25',
          new: true,
        },
        {
          title: '[건강상식]어지러움이 심해질 때 대처방법에 대해서 알려드립니다.',
          date: '2022.04.23',
          new: false,
        },
      ],
    };
  },
  components: {
    NoticeList,
    NoticeDetail,
  },
  computed: {
    ...mapState({
      isMobile: 'isMobile',
    }),
  },
};
</script>

<style></style>
