<template>
  <div class="content-wrap">
    <validation-observer tag="fragment">
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
          <div class="form-box" v-if="currentTab == 0">
            <validation-provider name="성명" rules="required" immediate tag="fragment" v-model="state.name">
              <text-field id="name" label="성명" v-model="state.name" />
            </validation-provider>
            <validation-provider name="휴대폰 번호" rules="required" immediate tag="fragment">
              <text-field id="phone" type="tel" label="휴대폰 번호" placeholder="(-)구분 없이 입력" v-model="state.phone" />
            </validation-provider>
            <validation-provider name="생년월일" rules="required" immediate v-model="state.birth" tag="fragment">
              <text-field id="birth" class="tb-inblock" type="number" label="생년월일" placeholder="8자리 입력 (19920812)" v-model="state.birthDate">
                <template>
                  <p class="ipt-rdo-switch disabled">
                    <input type="radio" name="gender" id="gender01" v-model="state.sex" value="M" />
                    <label for="gender01">남</label>
                    <input type="radio" name="gender" id="gender02" v-model="state.sex" value="F" />
                    <label for="gender02">여</label>
                  </p>
                </template>
              </text-field>
            </validation-provider>
          </div>

          <!-- 비밀번호 찾기 -->
          <div class="form-box" v-if="currentTab == 1">
            <validation-provider name="아이디" rules="required" immediate tag="fragment">
              <text-field id="id" label="아이디" v-model="state.id" />
            </validation-provider>
            <validation-provider name="성명" rules="required" immediate tag="fragment">
              <text-field id="name" label="성명" v-model="state.name" />
            </validation-provider>
            <validation-provider name="휴대폰 번호" rules="required" immediate tag="fragment">
              <text-field id="phone" type="tel" label="휴대폰 번호" placeholder="(-)구분 없이 입력" v-model="state.phone" />
            </validation-provider>
          </div>
        </div>
      </div>

      <!-- 아이디 찾기 -->
      <div class="btn-wrap" v-if="currentTab == 0">
        <!-- <router-link custom v-slot="{ navigate }" :to="{ name: 'find-id' }"> -->
        <button type="button" class="btn-txt navy" @click="findID">아이디 찾기</button>
        <!-- </router-link> -->
      </div>

      <!-- 비밀번호 찾기 -->
      <div class="btn-wrap" v-if="currentTab == 1">
        <!-- <router-link custom v-slot="{ navigate }" :to="{ name: 'find-pw' }"> -->
        <button type="button" class="btn-txt navy" @click="findPW">비밀번호 재설정</button>
        <!-- </router-link> -->
      </div>
    </validation-observer>
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
import patientService from '@/services/server/api/patient.js';
const INIT_STATE = () => ({
  id: '',
  name: '',
  phone: '',
  birthDate: '',
  sex: '',
});

export default {
  data() {
    return {
      state: INIT_STATE(),
      currentTab: 0,
      tabs: ['아이디 찾기', '비빌번호 찾기'],
    };
  },
  methods: {
    findID() {
      if (!this.$dayjs(this.state.birthDate, 'YYYYMMDD', true).isValid()) {
        this.$alert('날짜 형식이 틀렸습니다.');
      }
      patientService.findId(this.state.name, this.state.phone, this.state.birthDate, this.state.sex).then((args) => {
        if (args.code === '00') {
          console.log(args.loginId);
          this.$router.replace({ path: 'find/' + args.loginId });
        }
      });
    },
    findPW() {
      patientService.findPassword(this.id, this.name, this.phone).then((args) => {});
    },
  },
  created() {},
};
</script>

<style></style>
