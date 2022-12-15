<template>
  <div class="content-wrap">
    <div class="content">
      <tab :tabs="tabs" class="type02" scrollClass="scroll-x" @change="selectTab" />
      <div class="cont-inner pt0 tb-w100p">
        <accordion :accordionList="getQuestions" />
      </div>
    </div>
  </div>
</template>
<route>
{
  "meta": {
    "title" : "앱 이용 Q&A"
  }
}
</route>
<script>
import Tab from '@/common/components/Tab.vue';
import Accordion from '@/common/components/Accordion.vue';
import { QNA_DATA } from '@/modules/etc/qna.js';
import _cloneDeep from 'lodash/cloneDeep';
const INIT_STATE = () => ({
  accordionList: _cloneDeep(QNA_DATA),
});
const INIT_TOTAL_QUESTION = () => {
  const total = [];
  for (const question of _cloneDeep(QNA_DATA)) {
    total.push(...question);
  }
  return total;
};
export default {
  components: {
    Tab,
    Accordion,
  },
  data() {
    return {
      state: INIT_STATE(),
      selectedIndex: 0,
      tabs: ['전체', '비대면 진료', '복약 관리', '문진하기', '운동하기', '건강상태'],
      totalQuestion: INIT_TOTAL_QUESTION(),
    };
  },
  methods: {
    selectTab(index) {
      this.selectedIndex = index;
    },
  },
  computed: {
    getQuestions() {
      if (this.selectedIndex === 0) {
        return this.totalQuestion;
      } else {
        return this.state.accordionList[this.selectedIndex - 1];
      }
    },
  },
};
</script>

<style></style>
