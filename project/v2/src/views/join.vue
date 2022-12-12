<template>
  <div>
    <search-address v-if="showAddressSearch" @onSearch="searchAddress"></search-address>
    <div class="content-wrap" v-show="!showAddressSearch">
      <validation-observer slim v-slot="{ invalid, handleSubmit }">
        <form @submit.prevent="handleSubmit(regist)">
          <div class="content">
            <div class="cont-inner mb-space30 tb-full">
              <div class="form-box tb-half">
                <validation-provider name="아이디" rules="required" v-slot="{ errors }" slim>
                  <text-field class="block" id="id" label="아이디" v-model.trim="state.loginId" :errorMsgs="[errors[0]]">
                    <template>
                      <button type="button" class="btn-line-rnd" :disabled="pass.dupLoginId === state.loginId || errors[0]" @click="duplicate">
                        중복확인
                      </button>
                    </template>
                    <!-- <template slot="noti">
                  <p class="ipt-txt error">이미 사용중인 아이디입니다.</p>
                  <p class="ipt-txt possible">사용 가능한 아이디 입니다.</p>
                </template> -->
                  </text-field>
                </validation-provider>
                <validation-provider name="비밀번호" rules="required" vid="password" slim v-slot="{ errors }">
                  <text-field
                    id="pw"
                    class="tb-inblock"
                    type="password"
                    label="비밀번호"
                    v-model="state.password"
                    :errorMsgs="[errors[0]]"
                  ></text-field>
                </validation-provider>
                <validation-provider name="비밀번호 확인" rules="required|confirmed:password" slim v-slot="{ errors }">
                  <text-field
                    id="pwChk"
                    class="tb-inblock"
                    type="password"
                    label="비밀번호 확인"
                    v-model="state.confirmPassword"
                    :errorMsgs="[errors[0]]"
                  ></text-field>
                </validation-provider>
                <validation-provider name="성명" rules="required" slim>
                  <text-field id="name" class="tb-inblock" label="성명" disabled v-model="state.patientNm">
                    <template>
                      <button type="button" class="btn-line-rnd" @click="openMobileCheck">본인 인증</button>
                    </template>
                  </text-field>
                </validation-provider>
                <validation-provider name="생년월일" rules="required" slim>
                  <text-field
                    id="birth"
                    class="tb-inblock"
                    type="number"
                    v-model="state.birthDate"
                    label="생년월일"
                    placeholder="6자리 입력 (920812)"
                    disabled
                  >
                    <template>
                      <p class="ipt-rdo-switch disabled">
                        <input type="radio" name="gender" id="gender01" v-model="state.sex" value="M" disabled />
                        <label for="gender01">남</label>
                        <input type="radio" name="gender" id="gender02" v-model="state.sex" value="F" disabled />
                        <label for="gender02">여</label>
                      </p>
                    </template>
                  </text-field>
                </validation-provider>
                <validation-provider name="휴대폰 번호" rules="required" slim>
                  <text-field
                    id="phone"
                    class="tb-inblock"
                    type="tel"
                    label="휴대폰 번호"
                    placeholder="(-)구분 없이 입력"
                    v-model="state.cellPhone"
                    disabled
                  ></text-field>
                </validation-provider>
                <validation-provider name="보호자 연락처" rules="required|ko_phone" v-slot="{ errors }" slim>
                  <text-field
                    id="phone02"
                    class="tb-inblock"
                    type="tel"
                    label="보호자 연락처"
                    placeholder="(-)구분 없이 입력"
                    v-model="state.guardianCellPhone"
                    :errorMsgs="[errors[0]]"
                  ></text-field>
                </validation-provider>
                <div class="form-item full">
                  <label for="address" class="form-ttl">주소</label>
                  <div class="ipt-address-wrap">
                    <div class="ipt-wrap">
                      <validation-provider name="주소" rules="required" slim>
                        <input type="text" id="address" readonly v-model="state.address1" placeholder="도로명 주소 입력" />
                      </validation-provider>
                      <button type="button" class="btn-line-rnd" @click="showAddressSearch = true">주소 검색</button>
                    </div>
                    <div class="ipt-wrap">
                      <input type="text" title="상세주소" v-model="state.address2" placeholder="상세주소 입력" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="btn-wrap">
            <button type="submit" class="btn-txt navy" :disabled="invalid">완료</button>
          </div>
        </form>
      </validation-observer>
    </div>
  </div>
</template>
<route>
{
  "meta": {
    "title": "회원가입"
  }
}
</route>
<script>
import Vue from 'vue';
import { patientService } from '@/services/api';
import SearchAddress from '@/components/SearchAddress.vue';
import { MODE } from '@/common/config';
import { ENUM_MODE } from '@/common/constants';
import { decryptMobileAuth, mobileAuthOpen } from '@/common/helpers';
import { BIND_RESTORE_EVENT, UNBIND_RESTORE_EVENT } from '@/native/cycle';
import { PARAM_DATA } from '@/native/data';

const INIT_STATE = () => ({
  loginId: '',
  password: '',
  confirmPassword: '',
  patientNm: '',
  birthDate: '',
  sex: 'M',
  cellPhone: '',
  guardianCellPhone: '',
  zipCode: '',
  address1: '',
  address2: '',
});

const DEV_INIT_STATE = () => ({
  loginId: 'testadmin',
  password: '1234',
  confirmPassword: '1234',
  patientNm: '홍길동',
  birthDate: '19760201',
  sex: 'M',
  cellPhone: '01012345678',
  guardianCellPhone: '01012341234',
  zipCode: '06120',
  address1: '서울 강남구 봉은사로5길 4 (논현동)',
  address2: '상세',
});
export default {
  components: { SearchAddress },
  data() {
    return {
      state: MODE === ENUM_MODE.PROD ? INIT_STATE() : DEV_INIT_STATE(),
      showAddressSearch: false,
      pass: {
        dupLoginId: '',
        authCheck: false,
      },
    };
  },
  beforeRouteEnter(to, from, next) {
    if (to.params.userInfo) next();
    else {
      Vue.$alert('잘못된 접근입니다.');
      next({ name: 'target-check' });
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.showAddressSearch) {
      this.showAddressSearch = !this.showAddressSearch;
      next(false);
    } else next();
  },
  created() {
    this.state = {
      ...this.state,
      ...this.$route.params.userInfo,
    };
    this.$nativeScript(BIND_RESTORE_EVENT, this.mobileCheckResult);
  },
  beforeDestroy() {
    this.$nativeScript(UNBIND_RESTORE_EVENT, this.mobileCheckResult);
  },
  methods: {
    async openMobileCheck() {
      await mobileAuthOpen();
    },
    mobileCheckResult() {
      const result = this.$nativeScript(PARAM_DATA, 'phoneAuthResult');
      this.$nativeScript(PARAM_DATA, 'phoneAuthResult', '');
      if (result && result.priinfo) {
        decryptMobileAuth(result.priinfo).then(({ birth, name, phone }) => {
          if (birth !== this.state.birthDate || name !== this.state.patientNm || phone !== this.state.cellPhone) {
            this.pass.authCheck = false;
            this.$alert('본인인증을 실패하였습니다.<br/> 인증 정보가 일치하지 않습니다.');
          } else {
            this.pass.authCheck = true;
          }
        });
      }
    },
    async duplicate() {
      const { loginId } = this.state;
      const {
        code,
        message,
        data: { dupYn },
      } = await patientService.duplicate(loginId);
      if (dupYn === 'Y') {
        this.$alert('사용중인 아이디입니다.');
      } else {
        this.$alert('사용가능한 아이디입니다.');
        this.pass.dupLoginId = loginId;
      }
    },
    async regist() {
      if (this.pass.dupLoginId !== this.state.loginId) return this.$alert('아이디 중복체크를 진행해주세요.');
      if (!this.pass.authCheck) return this.$alert('본인인증을 진행해주세요.');
      const { loginId, password, patientNm, birthDate, sex, cellPhone, guardianCellPhone, zipCode, address1, address2 } = this.state;
      await patientService.join(loginId, password, patientNm, birthDate, sex, cellPhone, guardianCellPhone, zipCode, address1, address2);
      await this.$alert('가입 및 로그인이 완료되었습니다.');
      this.$router.replace({ name: 'login' });
    },
    searchAddress({ address, zipCode, lat, lng }) {
      this.state.address1 = address;
      this.state.zipCode = zipCode;
      this.showAddressSearch = false;
    },
  },
};
</script>

<style></style>
