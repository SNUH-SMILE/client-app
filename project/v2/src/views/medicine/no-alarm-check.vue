<template>
  <div class="content-wrap">
    <validation-observer tag="fragment" ref="observer" v-slot="{ invalid }">
      <div class="content">
        <div class="cont-inner pt0 tb-w100p">
          <ul class="md-set-list">
            <li>
              <div class="hbox jc">
                <p class="ttl">복용일</p>
                <div class="right-area">
                  <strong class="txt txtc-blue">{{ date }}</strong>
                </div>
              </div>
            </li>
            <li>
              <div class="hbox jc">
                <p class="ttl">약물 이름 <br /><span class="fs-nm">(필수 입력)</span></p>
                <div class="right-area">
                  <div class="ipt-wrap">
                    <validation-provider name="약물 이름" rules="required" slim>
                      <input
                        type="text"
                        title="약물 이름"
                        placeholder="입력해 주세요."
                        :value="state.drugName"
                        @input="state.drugName = $event.target.value"
                      />
                    </validation-provider>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div class="hbox jc">
                <p class="ttl">복용량 <br /><span class="fs-nm">(선택 입력)</span></p>
                <div class="right-area ipt-form">
                  <div class="ipt-wrap flex">
                    <validation-provider name="복용량" rules="required" slim>
                      <input type="number" title="복용량" placeholder="입력해 주세요." v-model="state.drugCount" />
                    </validation-provider>
                  </div>
                  <p class="ipt-select">
                    <select title="복용량" v-model="state.drugType">
                      <option v-for="item in drugTypes" :key="`drug-type-${item.value}`" :value="item.value">{{ item.label }}</option>
                    </select>
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="btn-wrap">
        <button type="button" class="btn-txt navy" @click="onSubmit" :disabled="invalid">저장</button>
      </div>
    </validation-observer>
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
import { ENUM_DATE_FORMAT, FORM_DRUG_TYPE } from '@/common/constants';
import { drugService } from '@/services/api';
import { mapGetters } from 'vuex';
import { LOGIN_ID } from '@/modules/patient';
const INIT_STATE = () => ({
  drugName: '',
  drugCount: '',
  drugType: '0',
});

export default {
  data() {
    return {
      state: INIT_STATE(),
      drugTypes: FORM_DRUG_TYPE,
      date: this.$dayjs().format(ENUM_DATE_FORMAT.PeriodYmd),
    };
  },
  computed: {
    ...mapGetters({ loginId: LOGIN_ID }),
  },
  methods: {
    async onSubmit() {
      const loginId = this.loginId;
      const today = this.$dayjs();
      const resultDate = today.format(ENUM_DATE_FORMAT.YMD);
      const resultTime = today.format(ENUM_DATE_FORMAT.Hm);
      const { drugName, drugCount, drugType } = this.state;
      await drugService.setEtcResult(loginId, resultDate, resultTime, drugName, drugCount, drugType);
      this.$toast('입력하신 내용이 저장되었습니다.');
      this.$router.back();
    },
  },
};
</script>

<style></style>
