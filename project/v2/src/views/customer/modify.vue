<template>
  <div class="content-wrap">
    <validation-observer tag="fragment">
      <div class="content">
        <div class="cont-inner mb-space30 tb-full">
          <div class="form-box tb-half">
            <div class="form-item block">
              <validation-provider name="아이디" rules="required" immediate tag="fragment">
                <text-field id="id" label="아이디" v-model="state.id" disabled="disabled" />
              </validation-provider>
            </div>
            <div class="form-item tb-inblock">
              <validation-provider name="성명" rules="required" immediate tag="fragment">
                <text-field id="name" label="성명" disabled="disabled" v-model="state.name" />
              </validation-provider>
            </div>
            <div class="form-item tb-inblock">
              <validation-provider name="생년월일" rules="required" immediate v-model="state.birth" tag="fragment">
                <text-field id="birth" type="number" label="생년월일" placeholder="6자리 입력 (920812)" disabled="disabled">
                  <template>
                    <p class="ipt-rdo-switch disabled">
                      <input type="radio" name="gender" id="gender01" v-model="state.gender" value="M" disabled />
                      <label for="gender01">남</label>
                      <input type="radio" name="gender" id="gender02" v-model="state.gender" value="F" disabled />
                      <label for="gender02">여</label>
                    </p>
                  </template>
                </text-field>
              </validation-provider>
            </div>
            <div class="form-item tb-inblock">
              <validation-provider name="비밀번호 수정" rules="required" immediate tag="fragment">
                <text-field id="pw" type="password" label="비밀번호 수정" v-model="state.pw"></text-field>
              </validation-provider>
            </div>
            <div class="form-item tb-inblock">
              <validation-provider name="비밀번호 수정 확인" immediate tag="fragment">
                <text-field id="pwChk" type="password" label="비밀번호 수정 확인" v-model="state.pw2">
                  <template slot="noti">
                    <p class="ipt-txt error">비밀번호가 일치하지 않습니다.</p>
                  </template>
                </text-field>
              </validation-provider>
            </div>
            <div class="form-item tb-inblock">
              <validation-provider name="휴대폰 번호" rules="required" immediate tag="fragment">
                <text-field id="phone" type="tel" label="휴대폰 번호" placeholder="(-)구분 없이 입력" v-model="state.phone">
                  <template>
                    <button type="button" class="btn-line-rnd">본인 인증 후 변경</button>
                  </template>
                </text-field>
              </validation-provider>
            </div>
            <div class="form-item tb-inblock">
              <validation-provider name="보호자 연락처" rules="required" immediate tag="fragment">
                <text-field id="phone02" type="tel" label="보호자 연락처" placeholder="(-)구분 없이 입력" v-model="state.phone2"></text-field>
              </validation-provider>
            </div>
            <div class="form-item full">
              <label for="address" class="form-ttl">주소</label>
              <div class="ipt-address-wrap">
                <div class="ipt-wrap">
                  <input type="text" id="address" v-model="state.address" placeholder="도로명 주소 입력" />
                  <button type="button" cclass="btn-txt-reset" v-if="showReset">
                    <span class="txt-blind">입력 초기화</span>
                  </button>
                  <button type="button" class="btn-line-rnd">주소 검색</button>
                </div>
                <div class="ipt-wrap">
                  <input type="text" title="상세주소" v-model="state.address2" placeholder="상세주소 입력" />
                  <button type="button" class="btn-txt-reset" v-if="showReset">
                    <span class="txt-blind">입력 초기화</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="btn-wrap">
        <button type="button" class="btn-txt navy" disabled>수정</button>
      </div>
    </validation-observer>
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
const INIT_STATE = () => ({
  id: '',
  pw: '',
  pw2: '',
  name: '',
  birth: '',
  gender: 'M',
  phone: '',
  phone2: '',
  address: '',
  address2: '',
});

export default {
  components: {},
  data() {
    return {
      state: INIT_STATE(),
      showReset: false, //인풋 초기화 버튼
    };
  },
};
</script>

<style></style>
