<template>
  <div>
    <!-- mobile -->
    <div class="content-wrap tb-none" v-show="isMobile">
      <div class="content">
        <div class="cont-inner pt0">
          <notice-list :notiList="inquiryList" textClass="ellipsis" />
        </div>
      </div>
      <div class="btn-wrap">
        <router-link custom v-slot="{ navigate }" :to="{ name: 'customer-inquiry-write' }">
          <button type="button" class="btn-txt navy" @click="navigate">문의 등록하기</button>
        </router-link>
      </div>
    </div>

    <!-- tablet -->
    <div class="content-wrap mb-none" v-show="!isMobile">
      <div class="content tb-h100p">
        <div class="half-cont-inner">
          <div class="left-area">
            <notice-list :notiList="inquiryList" class="scroll-y" textClass="ellipsis" />
            <div class="gray-info-box">
              <p class="txt">격리 생활 중 어려움이 있으시다면 <br />도움말을 제공해드립니다.</p>
              <router-link custom v-slot="{ navigate }" :to="{ name: 'customer-inquiry-write' }">
                <button type="button" class="btn-txt navy" @click="navigate">문의 등록하기</button>
              </router-link>
            </div>
          </div>
          <div class="right-area scroll-y bg-lgray">
            <inquiry-detail />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<route>
{
  "meta": {
    "title": "문의하기"
  }
}
</route>
<script>
import { mapState } from 'vuex';
import NoticeList from '@/components/NoticeList.vue';
import InquiryDetail from '@/components/InquiryDetail.vue';

const INIT_STATE = () => ({});

export default {
  data() {
    return {
      state: INIT_STATE(),
      inquiryList: [
        {
          title: '자가 격리 물품은 어떻게 받을 수 있나요',
          date: '2021.11.01',
          answer: true,
        },
        {
          title: '생활 규칙 관련 문의 드립니다',
          date: '2021.10.30',
          answer: false,
        },
      ],
    };
  },
  components: {
    NoticeList,
    InquiryDetail,
  },
  computed: {
    ...mapState({
      isMobile: 'isMobile',
    }),
  },
};
</script>

<style></style>
