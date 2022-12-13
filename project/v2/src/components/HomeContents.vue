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

      <app-home-healths />

      <app-home-medicine />
      <app-home-exercise />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { MAIN_CONTENT } from '@/modules/main';
import AppHomeHealths from '@/modules/main/AppHomeHealths.vue';
import AppHomeExercise from '@/modules/main/AppHomeExercise.vue';
import AppHomeMedicine from '@/modules/main/AppHomeMedicine.vue';
// import _each from 'lodash/each';
// const DETAIL_BEALTH_FUNC_NM = '__onDetailHealthCB';
// const ON_CNANGE_TEMP_FUNC_NM = 'onChangeTemp';
// const ON_CHANGE_STEP_FUNC_NM = 'onChangeStep';
// const ON_CHANGE_RATE_FUNC_NM = 'onChangeRate';
export default {
  components: { AppHomeHealths, AppHomeExercise, AppHomeMedicine },
  name: 'home-contents',
  data() {
    return {
      questionShow: true, //문진하기
      questionList: [
        //문진하기 데이터
        {
          disabled: true,
          title: '오전 문진',
          button: '작성완료',
        },
        {
          disabled: false,
          title: '오후 문진',
          button: '작성하기',
        },
      ],
      diagnosisShow: false, //비대면 진료
      pillShow: false, //복약관리
      // exerciseShow: true, //운동하기
    };
  },

  created() {
    this.fetchContents();
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({ fetchContents: MAIN_CONTENT }),
  },
};
</script>

<style></style>
