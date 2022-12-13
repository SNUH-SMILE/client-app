<template>
  <div class="content-wrap">
    <div class="content">
      <div class="cont-inner mb-space30">
        <h1 class="ttl-l">
          <strong>자가격리</strong> <span class="fw-100">APP</span>을 <br class="tb-none" />사용하기 전 <br />아래
          <span class="fw-500 txtc-blue">약관에 동의</span>해 <br class="tb-none" />주세요.
        </h1>
        <div class="agree-wrap">
          <p class="ipt-chk all-chk-box">
            <input type="checkbox" id="allChk" v-model="allTerms" />
            <label for="allChk">전체 동의</label>
          </p>
          <ul class="agree-list">
            <li v-for="(item, index) in terms" :key="`${item.value}-${index}`">
              <p class="ipt-chk">
                <input type="checkbox" :id="`${item.value}-chk-${index}`" v-model="selected" :value="item.value" />
                <label :for="`${item.value}-chk-${index}`" v-text="item.title">IITP 자가 격리 앱 서비스 이용약관</label>
              </p>
              <button type="button" class="btn-ic-detail" @click="openDetail(item.value)">
                <span class="txt-blind">상세보기</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="btn-wrap">
      <router-link custom v-slot="{ navigate }" :to="{ name: 'target-check' }">
        <button type="button" class="btn-txt navy" @click="navigate" :disabled="invalid">다음</button>
      </router-link>
    </div>
  </div>
</template>
<route>
{
  "meta": {
    "title": "약관동의"
  }
}
</route>
<script>
const INIT_STATE = () => ({});

export default {
  data() {
    return {
      terms: [
        {
          title: 'IITP 자가 격리 앱 서비스 이용약관',
          value: 'app',
        },
        {
          title: '개인정보 수집 및 이용 동의',
          value: 'info',
        },
        {
          title: '개인정보 제3자 제공 동의',
          value: 'data',
        },
      ],
      selected: [],
    };
  },
  computed: {
    allTerms: {
      get() {
        return this.selected.length === this.terms.length;
      },
      set(newValue) {
        if (newValue) {
          this.selected = this.terms.map(({ value }) => value);
        } else {
          this.selected = [];
        }
      },
    },
    invalid() {
      return !this.allTerms;
    },
  },
  methods: {
    openDetail(term) {
      // TODO: detail 정의되면 처리
      this.$alert('개발 대기중입니다.');
    },
  },
};
</script>

<style></style>
