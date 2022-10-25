<template>
  <div class="content-wrap">
    <div class="content">
      <div class="cont-inner pt0 tb-w100p">
        <notice-list :notiList="notiList" class="tb-icon-none"></notice-list>
      </div>
    </div>
  </div>
</template>
<route>
{
  "meta": {
    "title": "알림"
  }
}
</route>
<script>
import NoticeList from '@/components/NoticeList.vue';

const INIT_STATE = () => ({});

export default {
  components: {
    NoticeList,
  },
  data() {
    return {
      state: INIT_STATE(),
      notiList: [
        {
          title: '오늘은 격리 해제일입니다. 고생 많으셨습니다.',
          date: '2022.05.11',
        },
        {
          title: '격리 장소를 이탈했습니다. 지정된 격리 장소로 복귀해 주세요.',
          date: '2022.05.10',
        },
      ],
    };
  },
};
</script>

<style></style>
