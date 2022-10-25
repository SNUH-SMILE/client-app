<template>
  <div class="content">
    <div class="cont-inner tb-full">
      <section class="section-box">
        <div class="section-ttl-box">
          <h2 class="section-ttl">문진하기</h2>
          <router-link custom v-slot="{ navigate }" :to="{ name: 'history-taking' }">
            <button type="button" class="btn-ic-txt arrow" @click="navigate">바로가기</button>
          </router-link>
        </div>
        <!-- nodata -->
        <div class="nodata-box" v-if="!questionShow">
          <p>작성하실 문진이 없습니다.</p>
        </div>
        <!-- yesdata -->
        <ul class="question-list" v-if="questionShow">
          <li v-for="item in questionList" :key="item.index">
            <button type="button" :disabled="item.disabled">
              <span class="ttl">{{ item.title }}</span>
              <span class="lb-rnd-txt">{{ item.button }}</span>
            </button>
          </li>
        </ul>
      </section>

      <section class="section-box">
        <div class="section-ttl-box">
          <h2 class="section-ttl">비대면 진료</h2>
          <router-link custom v-slot="{ navigate }" :to="{ name: 'doctor' }">
            <button type="button" class="btn-ic-txt arrow" @click="navigate">바로가기</button>
          </router-link>
        </div>
        <!-- nodata -->
        <div class="nodata-box" v-if="!diagnosisShow">
          <p class="ic-txt diagnosis">오늘 예약된 비대면 진료가 없습니다.</p>
        </div>

        <div class="info-center-box" v-if="diagnosisShow">
          <p class="txt-info"><strong class="ic-txt diagnosis">14:30</strong>에 예약된 진료가 있습니다.</p>
        </div>
      </section>

      <section class="section-box">
        <div class="section-ttl-box">
          <h2 class="section-ttl">건강상태</h2>
          <button type="button" class="btn-ic-txt refresh" @click="refresh">새로고침</button>
        </div>
        <ul class="health-list">
          <li>
            <router-link custom v-slot="{ navigate }" :to="{ name: 'state-temper' }">
              <button type="button" @click="navigate">
                <span class="health-list-ttl ic-temp">체온</span>
                <!-- nodata -->
                <span class="txtc-gray" v-if="!today.bt">오늘은 측정된 정보가 없습니다.</span>
                <!-- yesdata -->
                <span class="data" v-else><strong class="num">36.5</strong> ℃</span>
              </button>
            </router-link>
          </li>
          <li>
            <router-link custom v-slot="{ navigate }" :to="{ name: 'state-blood' }">
              <button type="button" @click="navigate">
                <span class="health-list-ttl ic-blood">혈압</span>
                <!-- nodata -->
                <span class="txtc-gray" v-if="!today.bp">오늘은 측정된 정보가 없습니다.</span>
                <!-- yesdata -->
                <span class="data" v-else
                  ><strong class="num">{{ today.hr.high }}/{{ today.hr.low }}</strong> mmHg</span
                >
              </button>
            </router-link>
          </li>
          <li>
            <router-link custom v-slot="{ navigate }" :to="{ name: 'state-heart' }">
              <button type="button" @click="navigate">
                <span class="health-list-ttl ic-heart">심박수</span>
                <!-- nodata -->
                <span class="txtc-gray" v-if="!today.bt">오늘은 측정된 정보가 없습니다.</span>
                <!-- yesdata -->
                <span class="data" v-else>
                  <strong class="num">{{ today.hr }}</strong> 회/분
                </span>
              </button>
            </router-link>
          </li>
          <li>
            <router-link custom v-slot="{ navigate }" :to="{ name: 'state-oxygen' }">
              <button type="button" @click="navigate">
                <span class="health-list-ttl ic-oxygen">산소포화도</span>
                <!-- nodata -->
                <span class="txtc-gray" v-if="!today.spo2">오늘은 측정된 정보가 없습니다.</span>
                <!-- yesdata -->
                <span class="data" v-else
                  ><strong class="num">{{ today.spo2 }}</strong> %</span
                >
              </button>
            </router-link>
          </li>
          <li>
            <router-link custom v-slot="{ navigate }" :to="{ name: 'state-step' }">
              <button type="button" @click="navigate">
                <span class="health-list-ttl ic-walk">걸음수</span>
                <!-- nodata -->
                <span class="txtc-gray" v-if="!today.step">오늘은 측정된 정보가 없습니다.</span>
                <!-- yesdata -->
                <span class="data" v-else
                  ><strong class="num">{{ today.step }}</strong> 걸음</span
                >
              </button>
            </router-link>
          </li>
          <li>
            <router-link custom v-slot="{ navigate }" :to="{ name: 'state-sleep' }">
              <button type="button" @click="navigate">
                <span class="health-list-ttl ic-sleep">수면</span>
                <!-- nodata -->
                <span class="txtc-gray" v-if="!today.sleep">오늘은 측정된 정보가 없습니다.</span>
                <!-- yesdata -->
                <span class="data" v-else
                  ><strong class="num">{{ today.sleep }}</strong
                  >시간 <strong class="num">30</strong>분</span
                >
              </button>
            </router-link>
          </li>
        </ul>
      </section>

      <section class="section-box">
        <div class="section-ttl-box">
          <h2 class="section-ttl">복약관리</h2>
          <router-link custom v-slot="{ navigate }" :to="{ name: 'medicine' }">
            <button type="button" class="btn-ic-txt arrow" @click="navigate">바로가기</button>
          </router-link>
        </div>
        <!-- nodata -->
        <div class="nodata-box" v-if="!pillShow">
          <p class="ic-txt pill">설정된 복약 알림이 없습니다.</p>
        </div>
        <!-- yesdata -->
        <div class="info-center-box" v-if="pillShow">
          <p class="txt-info"><strong class="ic-txt pill">12:30</strong>에 드실 약이 있습니다.</p>
          <strong class="sub-txt">&ldquo; 점심 혈압 약 &rdquo;</strong>
        </div>
      </section>

      <section class="section-box">
        <div class="section-ttl-box">
          <h2 class="section-ttl">운동하기</h2>
          <router-link custom v-slot="{ navigate }" :to="{ name: 'exercise-before' }">
            <button type="button" class="btn-ic-txt arrow" @click="navigate">바로가기</button>
          </router-link>
        </div>
        <!-- nodata -->
        <div class="nodata-box" v-if="!exerciseShow">
          <p class="ic-txt exercise">예정된 운동이 없습니다.</p>
        </div>
        <!-- yesdata -->
        <div class="info-center-box" v-if="exerciseShow">
          <p class="txt-info"><strong class="ic-txt exercise">13:30</strong>에 운동이 예정되어 있습니다.</p>
          <strong class="sub-txt">&ldquo; 혈압에 좋은 오후 운동 &rdquo;</strong>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { detailBodyData, exMainData } from '@/services/native/health.js';
const DETAIL_BEALTH_FUNC_NM = '__onDetailHealthCB';
const ON_CNANGE_TEMP_FUNC_NM = 'onChangeTemp';
const ON_CHANGE_STEP_FUNC_NM = 'onChangeStep';
const ON_CHANGE_RATE_FUNC_NM = 'onChangeRate';
export default {
  name: 'home-contents',
  data() {
    return {
      questionShow: false, //문진하기
      questionList: [
        //문진하기 데이터
        {
          disabled: true,
          title: '오전 문진',
          button: '작성완료',
        },
        {
          disabled: true,
          title: '오후 문진',
          button: '작성불가',
        },
        {
          disabled: false,
          title: '격리 해제 30일 뒤 문진',
          button: '작성하기',
        },
      ],
      diagnosisShow: false, //비대면 진료
      pillShow: false, //복약관리
      exerciseShow: false, //운동하기
      today: {
        bp: null, // 혈압
        bt: null, // 체온
        hr: null, // 심박수 br : {high : 120, low : 80}
        sleep: null, // 수면
        spo2: null, // 산소포화도
        step: null, // 걸음
      },
    };
  },
  methods: {
    getHealthData: function () {
      exMainData(DETAIL_BEALTH_FUNC_NM);
    },
    refresh: function () {
      this.getHealthData();
    },
  },
  created() {
    window[DETAIL_BEALTH_FUNC_NM] = (args) => {
      if (args.code === '0000') {
        // bp: null, // 혈압
        // bt: null, // 체온
        // hr: null, // 심박수 br : {high : 120, low : 80}
        // sleep: null, // 수면
        // spo2: null, // 산소포화도
        // step: null, // 걸음
        console.log(args);
        // this.today.bp = args.todayBpList[-1];
        this.today.bt = args.todayBtList.at(-1).bt;
        this.today.hr = args.todayHrList.at(-1).hr;
        this.today.sleep = args.todayTotalSleepTime;
        this.today.spo2 = args.todaySpO2List.at(-1).spO2;
        this.today.step = args.todayStepCountList.at(-1).stepCount;
      }
    };
    window[ON_CNANGE_TEMP_FUNC_NM] = (args) => {
      // 체온 변화 있을때 콜백
      this.today.bt = args;
    };
    window[ON_CHANGE_STEP_FUNC_NM] = (args) => {
      // 걸음 수 변화있을 때 콜백
      this.today.step = args;
      console.log(args);
    };
    window[ON_CHANGE_RATE_FUNC_NM] = (args) => {
      // 10분 심박수 콜백
      console.log(args);
      // this.today.hr = hr;
    };
    this.getHealthData();
  },
};
</script>

<style></style>
