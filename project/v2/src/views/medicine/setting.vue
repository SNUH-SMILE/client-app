<template>
  <div class="content-wrap">
    <validation-observer tag="fragment">
      <div class="content">
        <div class="cont-inner pt0 tb-w100p">
          <ul class="md-set-list">
            <li>
              <div class="hbox jc">
                <p class="ttl">개인정보 수정</p>
                <div class="right-area">
                  <strong class="txt txtc-blue">2022.01.01</strong>
                </div>
              </div>
            </li>
            <li>
              <div class="hbox jc">
                <p class="ttl">복용 일수</p>
                <div class="right-area">
                  <p class="ipt-select">
                    <select title="복용 일수">
                      <option value="">1일</option>
                    </select>
                  </p>
                </div>
              </div>
            </li>
            <li>
              <div class="hbox jc">
                <p class="ttl">알림 이름 <br /><span class="fs-nm">(필수 입력)</span></p>
                <div class="right-area">
                  <div class="ipt-wrap">
                    <text-field type="text" title="약물 이름" placeholder="입력해 주세요." />
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div class="hbox jc">
                <p class="ttl">약물 정보 <br /><span class="fs-nm">(선택 입력)</span></p>
                <div class="right-area">
                  <button type="button" class="btn-line-rnd">추가</button>
                </div>
              </div>
              <ul class="sub-info-box">
                <li>
                  <p class="ttl">약물 이름</p>
                  <div class="right-area">
                    <div class="ipt-wrap">
                      <text-field type="text" title="약물 이름" placeholder="입력해 주세요." />
                    </div>
                  </div>
                </li>
                <li>
                  <p class="ttl">복용량 <br /><span class="fs-nm">(선택 입력)</span></p>
                  <div class="right-area ipt-form">
                    <div class="ipt-wrap flex">
                      <text-field type="number" title="복용량" placeholder="입력해 주세요." />
                    </div>
                    <p class="ipt-select">
                      <select title="복용량">
                        <option value="">알</option>
                      </select>
                    </p>
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <div class="hbox jc">
                <p class="ttl">복용 일수</p>
                <div class="right-area">
                  <button type="button" class="btn-line-rnd">추가</button>
                </div>
              </div>
              <ul class="sub-info-box">
                <li>
                  <p class="sub-ttl">알림 1</p>
                  <div class="right-area">
                    <button type="button" class="btn-txt-detail" @click="showModal">09:00</button>
                  </div>
                </li>
                <li>
                  <p class="sub-ttl">알림 2</p>
                  <div class="right-area">
                    <button type="button" class="btn-txt-detail" @click="showModal">12:00</button>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <div class="btn-wrap">
        <router-link custom v-slot="{ navigate }" :to="{ name: 'medicine' }">
          <button type="button" class="btn-txt navy" @click="navigate" disabled>저장</button>
        </router-link>
      </div>
    </validation-observer>
    <toast text="알림 설정 내용이 저장되었습니다." class="is-btm" v-show="toastShow" />
  </div>
</template>
<route>
{
  "meta": {
    "title": "복약 알림 설정"
  }
}
</route>
<script>
import Toast from '@/common/components/Toast.vue';

const INIT_STATE = () => ({});

export default {
  components: {
    Toast,
  },
  data() {
    return {
      state: INIT_STATE(),
      toastShow: false,
    };
  },
  created() {
    /**
     * 만약, Slot 사용 여부에 따라서 핸들링시  아래의 로직을 Header컴포넌트로 이동
     */
    this.$eventBus.$emit('setWarpClass', 'pg-fp');
  },
  beforeDestroy() {
    this.$eventBus.$emit('setWarpClass', '');
  },
  beforeRouteLeave(to, from, next) {
    next();
  },
  methods: {
    showModal() {
      this.$eventBus.$emit('openTimePicker');
    },
  },
};
</script>

<style></style>
