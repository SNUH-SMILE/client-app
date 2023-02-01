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
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">이상 증상</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in symptomList" :key="`symptom-${index}`">
                  <td class="txtc-blue">{{ item }}</td>
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
import { GET_INTERVIEW_LIST, GET_SYMPTOMLIST, GET_SYMPTOMLIST_BY_LOCAL } from '@/modules/history';
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
    ...mapGetters({ interviewList: GET_INTERVIEW_LIST, symptomList: GET_SYMPTOMLIST_BY_LOCAL }),
  },
  methods: {
    ...mapActions({ fetchList: GET_INTERVIEW_LIST }),
    async getLists() {
      this.fetchList(this.$dayjs().format(ENUM_DATE_FORMAT.YMD));
    },
    historyWrite({ interviewType }) {
      this.$eventBus.$emit('writeInterview', interviewType);
    },
  },
  async created() {
    await this.getLists();
  },
};
</script>

<style></style>
