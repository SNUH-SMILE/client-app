<template>
  <div class="content-wrap">
    <div class="content">
      <div class="gray-top-box center">
        <p class="bold fs-16">{{ today }}</p>
      </div>
      <div class="cont-inner mb-space20 tb-space20">
        <section class="section-box02">
          <h2 class="ttl-b">문진 작성 내역</h2>
          <ul class="history-list line-box">
            <li v-for="(item, index) in interviewList" :key="`interview-${index}`">
              <span class="time" v-if="item.interviewTime">{{ item.interviewTimeLabel }}</span>
              <div class="vbox">
                <p class="item">
                  <span class="ttl">{{ item.interviewTitle }}</span>
                  <button v-if="item.interviewStatus === '0'" type="button" class="btn-rnd blue" @click="historyWrite(item)">작성하기</button>
                  <button v-if="item.interviewStatus === '1'" type="button" class="btn-rnd blue dis-blue" disabled>작성예정</button>
                  <button v-if="item.interviewStatus === '2'" type="button" class="btn-rnd blue dis-gray" disabled>작성불가</button>
                  <button v-if="item.interviewStatus === '3'" type="button" class="btn-rnd blue" disabled>작성완료</button>
                </p>
              </div>
            </li>
          </ul>
        </section>
        <section class="section-box02">
          <h2 class="ttl-b">이상 증상 내역</h2>
          <div class="tbl-wrap line-box">
            <table class="tbl tbl-info no-line">
              <caption>
                이상 증상 내역
              </caption>
              <colgroup>
                <col style="width: 40%" />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">문진 이름</th>
                  <th scope="col">이상 증상</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in symptomList" :key="`symptom-${index}`">
                  <th scope="row">{{ item.interviewTitle }}</th>
                  <td :class="{ 'txtc-blue': item.symptomTitleLabel }">{{ item.symptomTitleLabel || '이상 증상 없음' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
<route>
{
  "meta": {
    "title": "문진 내역"
  }
}
</route>
<script>
import { mapActions, mapGetters } from 'vuex';
import {
  GET_INTERVIEW_LIST,
  GET_SYMPTOMLIST,
  TYPE_AM,
  TYPE_CONFIRMED_DAY,
  TYPE_ISOLATION_DAY,
  TYPE_ISOLATION_DAY_AFTER_30,
  TYPE_PM,
} from '@/modules/history';
import { ENUM_DATE_FORMAT } from '@/common/constants';
const INIT_STATE = () => ({});

export default {
  data() {
    return {
      today: this.$dayjs().format(ENUM_DATE_FORMAT.PeriodYmd),
      state: INIT_STATE(),
    };
  },
  computed: {
    ...mapGetters({ interviewList: GET_INTERVIEW_LIST, symptomList: GET_SYMPTOMLIST }),
  },
  methods: {
    ...mapActions({ fetchList: GET_INTERVIEW_LIST }),
    async getLists() {
      this.fetchList(this.$dayjs().format(ENUM_DATE_FORMAT.YMD));
    },
    historyWrite({ interviewType }) {
      let name;
      switch (interviewType) {
        case TYPE_CONFIRMED_DAY:
          name = 'history-taking-confirmed-day';
          break;
        case TYPE_ISOLATION_DAY:
          name = 'history-taking-isolation-clear';
          break;
        case TYPE_ISOLATION_DAY_AFTER_30:
          name = 'history-taking-isolation-clear-30';
          break;
        case TYPE_AM:
        case TYPE_PM:
        default:
          name = 'history-taking-am-pm';
          break;
      }
      this.$router.push({ name });
    },
  },
  async created() {
    await this.getLists();
  },
};
</script>

<style></style>
