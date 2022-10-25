<template>
  <div class="content-wrap">
    <validation-observer tag="fragment">
      <div class="content">
        <div class="cont-inner pt0 tb-w100p">
          <ul class="md-set-list">
            <li>
              <div class="hbox jc">
                <p class="ttl">복용일</p>
                <div class="right-area">
                  <strong class="txt txtc-blue">2022.01.01</strong>
                </div>
              </div>
            </li>
            <li>
              <div class="hbox jc">
                <p class="ttl">약물 이름 <br /><span class="fs-nm">(필수 입력)</span></p>
                <div class="right-area">
                  <div class="ipt-wrap">
                    <input type="text" title="약물 이름" placeholder="입력해 주세요." />
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div class="hbox jc">
                <p class="ttl">복용량 <br /><span class="fs-nm">(선택 입력)</span></p>
                <div class="right-area ipt-form">
                  <div class="ipt-wrap flex">
                    <input type="text" title="복용량" placeholder="입력해 주세요." />
                  </div>
                  <p class="ipt-select">
                    <select title="복용량">
                      <option value="">알</option>
                    </select>
                  </p>
                </div>
              </div>
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
    <toast class="is-btm" v-show="toastShow">입력하신 내용이 저장되었습니다.</toast>
  </div>
</template>
<route>
{
  "meta": {
    "title": "알림없이 체크하기"
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
      toastShow: true,
    };
  },
};
</script>

<style></style>
