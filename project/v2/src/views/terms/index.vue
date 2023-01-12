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
                <label :for="`${item.value}-chk-${index}`" v-text="item.title" />
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

let cachedTerm = [];
let once = false;

export default {
  data() {
    return {
      terms: [
        {
          title: '감염병 자가격리 및 생활치료센터 환자를 위한 앱 이용약관',
          value: 'app',
        },
        {
          title: '개인정보처리방침 및 수집이용',
          value: 'info',
        },
        // {
        //   title: '개인정보 제3자 제공 동의',
        //   value: 'data',
        // },
      ],
      selected: cachedTerm,
    };
  },
  beforeRouteEnter(to, from, next) {
    if (from.name === 'terms-id') {
      if (to.params.agree === true) {
        if (cachedTerm.indexOf(from.params.id) === -1) {
          cachedTerm.push(from.params.id);
        }
        once = true;
      }
    } else {
      cachedTerm = []; // 초기화
    }
    next();
  },
  created() {
    if (once) {
      this.$router.back();
      once = false;
    }
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
  watch: {
    selected(value) {
      cachedTerm = value;
    },
  },
  methods: {
    openDetail(term) {
      this.$router.push({ name: 'terms-id', params: { id: term } });
    },
  },
};
</script>

<style></style>
