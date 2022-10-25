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
            <li v-for="item in historyList" :key="item.index">
              <span class="time">{{ item.time }}</span>
              <div class="vbox">
                <p class="item" v-for="subData in item.subData" :key="subData.index">
                  <span class="ttl">{{ subData.title }}</span>
                  <button type="button" class="btn-rnd blue" :class="subData.buttonClass" :disabled="subData.disabled">
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
                <tr v-for="item in tableData" :key="item.index">
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
const INIT_STATE = () => ({});

export default {
  data() {
    return {
      state: INIT_STATE(),
      historyList: [
        {
          time: '09 : 56',
          subData: [
            {
              title: '오전 문진',
              button: '작성완료',
              buttonClass: '',
              disabled: true,
            },
            {
              title: '오후 문진',
              button: '작성불가',
              buttonClass: 'dis-gray',
              disabled: true,
            },
          ],
        },
        {
          time: '14 : 00',
          subData: [
            {
              title: '격리 해제 일 문진',
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
              title: '격리 해제 30일 후 문진',
              button: '작성하기',
              buttonClass: 'dis-blue',
              disabled: true,
            },
          ],
        },
      ],
      tableData: [
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
};
</script>

<style></style>
