<template>
  <div class="content-wrap">
    <validation-observer tag="fragment">
      <div class="content">
        <div class="cont-inner">
          <h1 class="ttl-m mb-space30">사용하실 기기를 선택하여 <br /><span class="txtc-blue">연결</span>해 주세요.</h1>
          <ul class="md-set-list pd-type02 mt30">
            <!-- <li>
                <div class="hbox jc">
                  <p class="ttl bold">블루투스</p>
                  <div class="right-area">
                    <p class="ipt-switch">
                      <input type="checkbox" title="블루투스 연결" />
                    </p>
                  </div>
                </div> 블루투스 연결 요청을 앱 내에서 하는 것 불가능
              </li> -->
            <li>
              <div class="hbox jc">
                <p class="ttl bold">검색 목록</p>
                <div class="right-area">
                  <button type="button" class="btn-ic-txt refresh" @click="refresh">새로고침</button>
                </div>
              </div>
              <!-- nodata -->
              <div class="nodata-box h-medium" v-if="state.list.length === 0">
                <p>조회된 기기가 없습니다.</p>
              </div>
              <!-- yesdata -->
              <ul class="sub-info-box" v-else>
                <li v-for="item in state.list" :key="item.deviceNm" @click="connect(item.deviceId)">
                  <p class="sub-ttl">{{ item.deviceNm }}</p>
                  <div class="right-area" v-if="item.deviceId === state.deviceId">
                    <span class="point-txt">연결됨</span>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </validation-observer>
  </div>
</template>
<route>
{
  "meta": {
    "title": "기기 목록"
  }
}
</route>
<script>
import { ON_BAND_SCAN, OFF_BAND_SCAN, BAND_CONNECT, IS_BAND_CONNECT, GET_LAST_DEVICE_ID, OFF_DEVICE_CONNECT } from '@/native/band';

const INIT_STATE = () => ({
  list: [],
  deviceId: '',
});
export default {
  data() {
    return {
      state: INIT_STATE(),
    };
  },
  async created() {
    this.$nativeScript(ON_BAND_SCAN, this.scanCallback);
    // if (this.$nativeScript(IS_BAND_CONNECT)) {
    //   const result = await this.$nativeScript(GET_LAST_DEVICE_ID);
    //   console.log(result);
    // }
  },
  beforeDestroy() {
    this.$nativeScript(OFF_BAND_SCAN);
  },
  methods: {
    scanCallback({ code, message, list }) {
      if (code === '0000') {
        this.state.list = list;
      }
    },
    refresh() {
      this.$nativeScript(ON_BAND_SCAN);
    },
    async connect(targetId) {
      if (this.state.deviceId === targetId) {
        this.$nativeScript(OFF_DEVICE_CONNECT);
        this.state.deviceId = '';
      } else {
        await this.$nativeScript(BAND_CONNECT, targetId);
        this.state.list.find(({ deviceId }) => targetId === deviceId);
        this.state.deviceId = targetId;
      }
    },
  },
};
</script>

<style></style>
