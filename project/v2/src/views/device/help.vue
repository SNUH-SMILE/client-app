<template>
  <div class="content-wrap">
    <validation-observer tag="fragment">
      <div class="content">
        <div class="cont-inner pt0">
          <div class="top-line-box">
            <h2 class="ttl-m">가민 기기 연결 시 <br />다음과 같이 진행하세요.</h2>
          </div>
          <ol class="device-info-list">
            <li>
              <span class="num">1.</span>
              <div class="device-info">
                <p class="icon-box">
                  <i class="img-icon googleplay"></i>
                  <i class="img-icon appstore"></i>
                </p>
                <p class="txt">
                  구글 플레이 또는 앱스토어에서
                  <br /><strong>Garmin Connect™(가민 커넥트)</strong> <br />앱을 다운받아 주세요.
                </p>
              </div>
            </li>
            <li>
              <span class="num">2.</span>
              <div class="device-info">
                <p class="icon-box">
                  <i class="img-icon garmin"></i>
                </p>
                <p class="txt">
                  가민 커넥트 앱에서 회원 가입 및 <br />기기 연결을 진행해주세요. <br />어려움이 있다면,
                  <a target="_blank" href="https://support.garmin.com/ko-KR/"><strong class="txtc-blue">사이트</strong></a
                  >를 참고하세요.
                </p>
              </div>
            </li>
            <li>
              <span class="num">3.</span>
              <div class="device-info">
                <p class="icon-box">
                  <i class="img-icon idcard"></i>
                </p>
                <p class="txt">SMILE 자가격리앱에서 <br /><strong>가민 회원정보</strong>를 입력해주세요.</p>
              </div>
            </li>
          </ol>
        </div>
      </div>
      <div class="btn-wrap">
        <button type="button" class="btn-txt navy" @click="showModal">연결하러 가기</button>
      </div>
    </validation-observer>
  </div>
</template>
<route>
{
  "meta": {
    "title": "가민 기기 연결 도움말"
  }
}
</route>
<script>
const INIT_STATE = () => ({});

export default {
  data() {
    return {
      state: INIT_STATE(),
    };
  },
  methods: {
    showModal() {
      this.$eventBus.$emit('openGarminConnect');
    },
  },
};
</script>

<style></style>
