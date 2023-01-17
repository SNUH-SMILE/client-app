<template>
  <fragment>
    <!-- mobile -->
    <div class="content-wrap tb-none" v-show="isMobile">
      <div class="content">
        <div class="cont-inner pt0">
          <app-support-question-list @selectedItem="openQuestionDetail" />
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
            <app-support-question-list @selectedItem="onSelectedItem" />
            <div class="gray-info-box">
              <p class="txt">격리 생활 중 어려움이 있으시다면 <br />도움말을 제공해드립니다.</p>
              <router-link custom v-slot="{ navigate }" :to="{ name: 'pop-inquiry-write' }">
                <button type="button" class="btn-txt navy" @click="navigate">문의 등록하기</button>
              </router-link>
            </div>
          </div>
          <div class="right-area scroll-y bg-lgray">
            <app-support-question-detail
              v-if="detail"
              :title="detail.questionTitle"
              :content="detail.questionBody"
              :date="detail.questionDateLabel"
              :answerContent="detail.answerBody"
              :answerDate="detail.answerDateLabel"
            />
          </div>
        </div>
      </div>
    </div>
  </fragment>
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
import AppSupportQuestionList from '@/modules/etc/AppSupportQuestionList.vue';
import AppSupportQuestionDetail from '@/modules/etc/AppSupportQuestionDetail.vue';

export default {
  data() {
    return {
      detail: null,
    };
  },
  components: {
    AppSupportQuestionList,
    AppSupportQuestionDetail,
  },
  computed: {
    ...mapState({
      isMobile: 'isMobile',
    }),
  },
  methods: {
    onSelectedItem(item) {
      this.detail = item;
    },
    openQuestionDetail(item) {
      this.$router.push({
        name: 'customer-inquiry-id',
        params: {
          detail: item,
        },
      });
    },
  },
};
</script>

<style></style>
