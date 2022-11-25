<template>
  <div class="content-wrap">
    <div class="content">
      <div class="tab-box">
        <ul class="tab">
          <li v-for="(tab, index) in tabs" :key="index" :class="{ selected: currentTab === index }">
            <button type="button" @click="currentTab = index">{{ tab }}</button>
          </li>
        </ul>
      </div>
      <div class="cont-inner mb-space30">
        <!-- 아이디 찾기 -->
        <validation-observer ref="findId" slim>
          <div class="form-box" v-if="currentTab == 0">
            <validation-provider name="성명" rules="required" slim v-slot="{ errors }">
              <text-field id="name" label="성명" v-model="findId.name" :errorMsgs="[errors[0]]" />
            </validation-provider>
            <validation-provider name="휴대폰 번호" rules="required|ko_phone" slim v-slot="{ errors }">
              <text-field id="phone" type="tel" label="휴대폰 번호" placeholder="(-)구분 없이 입력" v-model="findId.phone" :errorMsgs="[errors[0]]" />
            </validation-provider>
            <validation-provider name="생년월일" rules="required|default_date" slim v-slot="{ errors }">
              <text-field
                id="birth"
                class="tb-inblock"
                type="number"
                label="생년월일"
                placeholder="8자리 입력 (19920812)"
                v-model="findId.birth"
                :errorMsgs="[errors[0]]"
              >
                <p class="ipt-rdo-switch">
                  <input type="radio" name="gender" id="gender01" v-model="findId.sex" value="M" />
                  <label for="gender01">남</label>
                  <input type="radio" name="gender" id="gender02" v-model="findId.sex" value="F" />
                  <label for="gender02">여</label>
                </p>
              </text-field>
            </validation-provider>
          </div>
        </validation-observer>

        <!-- 비밀번호 찾기 -->
        <validation-observer ref="findPw" slim>
          <div class="form-box" v-if="currentTab == 1">
            <validation-provider name="아이디" rules="required" slim v-slot="{ errors }">
              <text-field id="id" label="아이디" v-model="findPw.id" :errorMsgs="[errors[0]]" />
            </validation-provider>
            <validation-provider name="성명" rules="required" slim v-slot="{ errors }">
              <text-field id="name" label="성명" v-model="findPw.name" :errorMsgs="[errors[0]]" />
            </validation-provider>
            <validation-provider name="휴대폰 번호" rules="required" slim v-slot="{ errors }">
              <text-field id="phone" type="tel" label="휴대폰 번호" placeholder="(-)구분 없이 입력" v-model="findPw.phone" :errorMsgs="[errors[0]]" />
            </validation-provider>
          </div>
        </validation-observer>
      </div>
    </div>

    <!-- 아이디 찾기 -->
    <div class="btn-wrap" v-if="currentTab == 0 && findIdValidator">
      <button type="button" class="btn-txt navy" :disabled="findIdValidator.flags.invalid" @click="onSubmitFindId">아이디 찾기</button>
    </div>

    <!-- 비밀번호 찾기 -->
    <div class="btn-wrap" v-if="currentTab == 1 && findPwValidator">
      <button type="button" class="btn-txt navy" :disabled="findPwValidator.flags.invalid" @click="onSubmitFindPw">비밀번호 재설정</button>
    </div>
  </div>
</template>
<route>
{
  "meta": {
    "title": "아이디 / 비밀번호 찾기"
  }
}
</route>
<script>
import { RESPONSE_STATUS } from '@/common/constants';
import { patientService } from '@/services/api';
const INIT_FIND_ID_FORM = () => ({
  name: '',
  phone: '',
  birth: '',
  sex: 'M',
});

const INIT_FIND_PW_FORM = () => ({
  id: '',
  name: '',
  phone: '',
});

export default {
  data() {
    return {
      findId: INIT_FIND_ID_FORM(),
      findPw: INIT_FIND_PW_FORM(),
      currentTab: 0,
      tabs: ['아이디 찾기', '비빌번호 찾기'],
      findIdValidator: null,
      findPwValidator: null,
    };
  },
  created() {},
  mounted() {
    this.findIdValidator = this.$refs.findId;
    this.findPwValidator = this.$refs.findPw;
  },
  computed: {},
  methods: {
    async onSubmitFindId() {
      const { name, phone, birth, sex } = this.findId;
      const {
        data: { loginId },
      } = await patientService.findId(name, phone, birth, sex);
      this.$router.replace({ name: 'find-id', params: { loginId, name } });
    },
    async onSubmitFindPw() {
      const { id, name, phone } = this.findPw;
      const {
        code,
        message,
        data: { existYn },
      } = await patientService.findPassword(id, name, phone);
      if (existYn === 'Y') {
        this.$router.replace({ name: 'find-pw', params: { loginId: id } });
      } else {
        this.$alert('환자정보가 존재하지 않습니다.');
      }
    },
  },
  watch: {
    currentTab() {
      this.findId = INIT_FIND_ID_FORM();
      this.findPw = INIT_FIND_PW_FORM();
    },
  },
};
</script>

<style></style>
