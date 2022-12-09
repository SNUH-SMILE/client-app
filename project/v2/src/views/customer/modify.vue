<template>
  <div>
    <search-address v-if="showAddressSearch" @onSearch="searchAddress"></search-address>
    <div class="content-wrap" v-show="!showAddressSearch">
      <validation-observer slim v-slot="{ invalid, handleSubmit }">
        <form @submit.prevent="handleSubmit(onSubmit)">
          <div class="content">
            <div class="cont-inner mb-space30 tb-full">
              <div class="form-box tb-half">
                <div class="form-item block">
                  <text-field id="id" label="아이디" :value="loginId" disabled />
                </div>
                <div class="form-item tb-inblock">
                  <text-field id="name" label="성명" disabled :value="userInfo.patientNm" />
                </div>
                <div class="form-item tb-inblock">
                  <text-field
                    id="birth"
                    class="tb-inblock"
                    type="number"
                    :value="userInfo.birthDate"
                    label="생년월일"
                    placeholder="6자리 입력 (920812)"
                    disabled
                  >
                    <template>
                      <p class="ipt-rdo-switch disabled">
                        <input type="radio" name="gender" id="gender01" v-model="userInfo.sex" value="M" disabled />
                        <label for="gender01">남</label>
                        <input type="radio" name="gender" id="gender02" v-model="userInfo.sex" value="F" disabled />
                        <label for="gender02">여</label>
                      </p>
                    </template>
                  </text-field>
                </div>
                <validation-provider name="휴대폰 번호" rules="required" slim>
                  <text-field
                    id="phone"
                    class="tb-inblock"
                    type="tel"
                    label="휴대폰 번호"
                    placeholder="(-)구분 없이 입력"
                    v-model="state.cellPhone"
                    disabled
                    ><template>
                      <button type="button" class="btn-line-rnd" @click="openMobileCheck">본인 인증 후 변경</button>
                    </template></text-field
                  >
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
            <button type="submit" class="btn-txt navy" :disabled="invalid">수정</button>
          </div>
        </form>
      </validation-observer>
    </div>
  </div>
</template>
<route>
{
  "meta": {
    "title": "개인정보 수정"
  }
}
</route>
<script>
import SearchAddress from '@/components/SearchAddress.vue';
import { BIND_RESTORE_EVENT, UNBIND_RESTORE_EVENT } from '@/native/cycle';
import { PARAM_DATA } from '@/native/data';
import { decryptMobileAuth, mobileAuthOpen } from '@/common/helpers';
import { mapActions, mapGetters } from 'vuex';
import { LOGIN_ID, SESSION } from '@/modules/patient';
import { patientService } from '@/services/api';
const INIT_STATE = () => ({
  cellPhone: '',
  guardianCellPhone: '',
  zipCode: '',
  address1: '',
  address2: '',
});

export default {
  components: { SearchAddress },
  data() {
    return {
      state: INIT_STATE(),
      showAddressSearch: false,
    };
  },
  async created() {
    this.$nativeScript(BIND_RESTORE_EVENT, this.mobileCheckResult);
    await this.fetchUserInfo();
    this.state.cellPhone = this.userInfo.cellPhone;
    this.state.guardianCellPhone = this.userInfo.guardianCellPhone;
    this.state.zipCode = this.userInfo.zipCode;
    this.state.address1 = this.userInfo.address1;
    this.state.address2 = this.userInfo.address2;
  },
  beforeRouteLeave(to, from, next) {
    if (this.showAddressSearch) {
      this.showAddressSearch = !this.showAddressSearch;
      next(false);
    } else next();
  },
  beforeDestroy() {
    this.$nativeScript(UNBIND_RESTORE_EVENT, this.mobileCheckResult);
  },
  computed: {
    ...mapGetters({ userInfo: SESSION, loginId: LOGIN_ID }),
  },
  methods: {
    ...mapActions({
      fetchUserInfo: SESSION,
    }),
    async openMobileCheck() {
      await mobileAuthOpen();
    },
    mobileCheckResult() {
      const result = this.$nativeScript(PARAM_DATA, 'phoneAuthResult');
      this.$nativeScript(PARAM_DATA, 'phoneAuthResult', '');
      if (result && result.priinfo) {
        decryptMobileAuth(result.priinfo).then(({ birth, name, phone }) => {
          if (birth !== this.state.birthDate || name !== this.state.patientNm || phone !== this.state.cellPhone) {
            this.$alert('본인인증을 실패하였습니다.<br/> 인증 정보가 일치하지 않습니다.');
          } else {
            this.state.cellPhone = phone;
          }
        });
      }
    },
    searchAddress({ address, zipCode, lat, lng }) {
      this.state.address1 = address;
      this.state.zipCode = zipCode;
      this.showAddressSearch = false;
    },
    async onSubmit() {
      await patientService.setPatient(
        this.loginId,
        this.state.cellPhone,
        this.state.guardianCellPhone,
        this.state.zipCode,
        this.state.address1,
        this.state.address2
      );
      await this.$alert('회원 정보가 수정 되었습니다.');
      this.$router.back();
    },
  },
};
</script>

<style></style>
