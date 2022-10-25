<template>
  <div class="content-wrap">
    <home-contents />
    <history-taking-alarm v-if="popup === 'alarm'" @onAction="onHtAlarmAction" />
  </div>
</template>
<script>
import HistoryTakingAlarm from '@/components/HistoryTakingAlarm.vue';
import HomeContents from '@/components/HomeContents.vue';
export default {
  name: 'home',
  components: {
    HistoryTakingAlarm,
    HomeContents,
  },
  data() {
    return {
      popup: '',
    };
  },
  methods: {
    onHtAlarmAction(action) {
      this.popup = '';
    },
  },
};
</script>

<style></style>
