<template>
  <div class="content-wrap">
    <div class="content">
      <div class="gray-top-box center">
        <p class="bold fs-16">2022.01.03</p>
      </div>
      <div class="cont-inner mb-space20 tb-space20">
        <section class="section-box02">
          <h2 class="ttl-b">문진 작성 내역</h2>
          <ul class="history-list line-box">
            <li v-for="item in interviewList" :key="item.index">
              <span class="time">{{ item.time }}</span>
              <div class="vbox">
                <p class="item" v-for="subData in item.subData" :key="subData.index">
                  <span class="ttl">{{ subData.title }}</span>
                  <button
                    type="button"
                    class="btn-rnd blue"
                    :class="subData.buttonClass"
                    :disabled="subData.disabled"
                    @click="movePage(subData.pathName)"
                  >
                    {{ subData.button }}
                  </button>
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
                <tr v-for="item in symptomList" :key="item.index">
                  <th scope="row">{{ item.title }}</th>
                  <td :class="item.textClass">{{ item.content }}</td>
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
import { mapActions } from 'vuex';
import { GET_INTERVIEW_LIST } from '@/modules/history';
const INIT_STATE = () => ({});
const GET_INTERVIEW_NAME = {
  '01': { title: '확진 당일 문진', pathName: 'history-taking-confirmed-day' },
  '02': { title: '오전 문진', pathName: 'history-taking-am-pm' },
  '03': { title: '오후 문진', pathName: 'history-taking-am-pm' },
  '04': { title: '격리 해제일 문진', pathName: 'history-taking-isolation-clear' },
  '05': { title: '격리 해제 30일 뒤 문진', pathName: 'history-taking-isolation-clear-30' },
};
const GET_INTERVIEW_STATUS = {
  0: { button: '작성 하기', buttonClass: '', disabled: false },
  1: { button: '작성 하기', buttonClass: 'dis-blue', disabled: true },
  2: { button: '작성 불가', buttonClass: 'dis-gray', disabled: true },
  3: { button: '작성 완료', buttonClass: '', disabled: true },
};

export default {
  data() {
    return {
      state: INIT_STATE(),
      interviewList: [
        {
          time: '09 : 56',
          subData: [
            {
              title: GET_INTERVIEW_NAME['01'].title,
              pathName: GET_INTERVIEW_NAME['01'].pathName,
              button: '작성하기',
              buttonClass: '',
              disabled: false,
            },
            {
              title: GET_INTERVIEW_NAME['02'].title,
              pathName: GET_INTERVIEW_NAME['02'].pathName,
              button: '작성하기',
              buttonClass: 'dis-gray',
              disabled: false,
            },
          ],
        },
        {
          time: '14 : 00',
          subData: [
            {
              title: GET_INTERVIEW_NAME['04'].title,
              pathName: GET_INTERVIEW_NAME['04'].pathName,
              button: '작성하기',
              buttonClass: '',
              disabled: false,
            },
          ],
        },
        {
          time: '16 : 30',
          subData: [
            {
              title: GET_INTERVIEW_NAME['05'].title,
              pathName: GET_INTERVIEW_NAME['05'].pathName,
              button: '작성하기',
              buttonClass: 'dis-blue',
              disabled: false,
            },
          ],
        },
      ],
      symptomList: [
        {
          title: '오전 문진',
          content: '이상 증상 없음',
          textClass: '',
        },
        {
          title: '오후 문진',
          content: '기침, 발열, 콧물, 인후통',
          textClass: 'txtc-blue',
        },
      ],
    };
  },
  components: {},
  methods: {
    ...mapActions({ getInterviewList: GET_INTERVIEW_LIST }),
    movePage(pathName) {
      this.$router.push({ name: pathName });
    },
    async getLists() {
      const today = this.$dayjs().format('YYYY.MM.DD');
      const result = await this.getInterviewList(today);
      console.log(result);
    },
  },
  created() {
    this.getLists();
    window.vm = this;
  },
};
</script>

<style></style>
