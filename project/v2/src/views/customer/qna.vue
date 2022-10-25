<template>
  <div class="content-wrap">
    <div class="content">
      <tab :tabs="tabs" class="type02" scrollClass="scroll-x" />
      <div class="cont-inner pt0 tb-w100p">
        <accordion />
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

const INIT_STATE = () => ({});

export default {
  components: {
    Tab,
    Accordion,
  },
  data() {
    return {
      state: INIT_STATE(),
      tabs: ['전체', '비대면 진료', '복약 관리', '문진하기', '운동하기', '건강상태'],
    };
  },
};
</script>

<style></style>
