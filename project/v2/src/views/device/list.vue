<template>
  <fragment>
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
                <div class="nodata-box h-medium" v-if="!deviceListShow">
                  <p>조회된 기기가 없습니다.</p>
                </div>
                <!-- yesdata -->
                <ul class="sub-info-box" v-if="deviceListShow">
                  <li v-for="item in state.list" :key="item.deviceNm" @click="selectBandItem(item)">
                    <p class="sub-ttl">{{ item.deviceNm }}</p>
                    <div class="right-area" v-show="item.connected">
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
    <loading v-show="loadingShow" />
  </fragment>
</template>
<route>
{
  "meta": {
    "title": "기기 목록"
  }
}
</route>
<script>
import Loading from '@/common/components/Loading.vue';
import { bindNativeEvent } from '@/services/native';
import { bandScan, bandConnect, isBandConnected, lastDeviceId, bandScanStop, bandDisconnect } from '@/services/native/device.js';

const SCAN_CB_FUNC_NM = '__onBandScanCB';
const BAND_CONNECT_FUNC_NM = '__onBandConnectCB';

const INIT_STATE = () => ({
  list: [],
  deviceId: '',
});
export default {
  data() {
    return {
      state: INIT_STATE(),
      toastShow: false,
      loadingShow: false,
      deviceListShow: false,
    };
  },
  components: {
    Loading,
  },
  methods: {
    /**
     * @describe 새로고침
     */
    refresh() {
      this.callBandScan();
    },

    /**
     * 밴드 리스트 조회 요청
     */
    callBandScan() {
      this.loadingShow = true;
      this.deviceListShow = false;
      bandScan(SCAN_CB_FUNC_NM);
    },

    /**
     * 밴드 연결 신청
     */
    BandConnectService(info) {
      console.log(info);
      bandConnect(info.deviceId, BAND_CONNECT_FUNC_NM);
      this.IsBandConnectedService();
    },
    /**
     * 밴드 연결 상태 확인
     */
    IsBandConnectedService() {
      isBandConnected().then((result) => {
        console.log('band connected state:' + result);
      });
    },
    /**
     * 밴드 연결 해제
     */
    bandDisconnectService() {
      this.$toast({ text: '기기 연결이 해제되었습니다.' });
      for (let i = 0; i < this.state.list.length; i++) {
        this.state.list[i].connected = false;
      }
      this.state.deviceId = '';
      bandDisconnect();
    },

    /**
     * 밴드 리스트 중 하나를 선택
     */
    selectBandItem(info) {
      if (info.deviceId === this.state.deviceId) {
        // 선택된 것을 선택 -> 연결 해제
        this.bandDisconnectService();
      } else {
        // 연결 하기
        this.BandConnectService(info);
      }
    },
  },
  computed: {},
  created() {
    window[SCAN_CB_FUNC_NM] = (args) => {
      this.loadingShow = false;
      if (args.list.length > 0) {
        this.deviceListShow = true;
      }
      this.state.list = args.list;
      console.log(args);
    };
    window[BAND_CONNECT_FUNC_NM] = (args) => {
      console.log(args);
      if (args.code === '0000' && args.message === 'SUCCESS') {
        this.$toast({ text: '기기가 연결되었습니다.' });
        console.log(this.state.list);
        this.state.deviceId = args.deviceId;
        for (let i = 0; i < this.state.list.length; i++) {
          if (this.state.list[i].deviceId === args.deviceId) {
            this.$set(this.state.list[i], 'connected', true);
          }
        }
      } else {
        this.$toast({ text: '연결에 실패하였습니다. 다시 시도해주세요.' });
      }
    };
  },

  beforeDestroy() {
    bandScanStop();
    window[SCAN_CB_FUNC_NM] = () => {
      // 방어 코드
      console.warn('만료된 함수입니다.' + SCAN_CB_FUNC_NM);
    };
  },
};
</script>

<style></style>
