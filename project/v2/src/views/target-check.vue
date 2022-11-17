<template>
  <div class="login-wrap">
    <validation-observer slim v-slot="{ invalid }">
      <div class="login-info">
        <h1 class="logo">
          <span class="txt-blind">SMILE</span>
        </h1>
        <p class="txt">어려움을 이겨내고 <br />평범한 일상에 함께 할 수 있기를 기원합니다.</p>
      </div>
      <div class="login-form">
        <validation-provider name="성명" rules="required" slim v-slot="{ errors }">
          <text-field v-model="state.patientNm" id="name" label="성명" :errorMsgs="[errors[0]]" reset />
        </validation-provider>
        <validation-provider name="생년월일" rules="required|default_date" slim v-slot="{ errors }">
          <text-field
            id="birth"
            label="생년월일"
            type="number"
            placeholder="8자리 입력 (19920812)"
            v-model="state.birthDate"
            reset
            :errorMsgs="[errors[0]]"
          />
        </validation-provider>
        <validation-provider name="휴대폰 번호" rules="required|ko_phone" slim v-slot="{ errors }">
          <text-field
            id="phone"
            label="휴대폰 번호"
            type="number"
            placeholder="(-)구분 없이 입력"
            v-model="state.cellPhone"
            reset
            :errorMsgs="[errors[0]]"
          />
        </validation-provider>
        <div class="form-item">
          <label for="gender" class="form-ttl">성별</label>
          <div class="ipt-rdo-box count02">
            <p class="ipt-rdo">
              <input type="radio" name="gender" id="gender01" value="M" v-model="state.sex" />
              <label for="gender01">남</label>
            </p>
            <p class="ipt-rdo">
              <input type="radio" name="gender" id="gender02" value="F" v-model="state.sex" />
              <label for="gender02">여</label>
            </p>
          </div>
        </div>
        <div class="btn-wrap">
          <button type="button" class="btn-txt navy" :disabled="invalid" @click="onSubmit">대상자 확인</button>
        </div>
      </div>
    </validation-observer>
  </div>
</template>

<script>
import { patientService } from '@/services/server/api';
import { ENUM_MODE, RESPONSE_STATUS } from '@/common/constants';
import { MODE } from '@/common/config';
const INIT_STATE = () => ({
  patientNm: '',
  birthDate: '',
  cellPhone: '',
  sex: 'M',
});
const DEV_INIT_STATE = () => ({
  patientNm: '홍길동',
  birthDate: '19760201',
  sex: 'M',
  cellPhone: '01012345678',
});

export default {
  layout: 'none',
  data() {
    return {
      state: MODE === ENUM_MODE.PROD ? INIT_STATE() : DEV_INIT_STATE(),
      showReset: false, //인풋 초기화 버튼
    };
  },
  methods: {
    async onSubmit() {
      const { patientNm, birthDate, cellPhone, sex } = this.state;
      const { code, message, data } = await patientService.identity(patientNm, birthDate, sex, cellPhone);
      this.$router.replace({
        name: 'join',
        params: {
          userInfo: { patientNm, birthDate, cellPhone, sex },
        },
      });
    },
  },
};
</script>

<style></style>
