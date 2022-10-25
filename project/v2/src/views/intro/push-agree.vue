<template>
  <modal-layout title="앱 PUSH 알림 수신" @onSubmit="next" bodyClass="pb0">
    <template slot="body">
      <p class="pop-txt">
        {{ now }} 알림 수신
        <br />
        <strong class="iht">&lsquo;수신&rsquo;</strong> 되었습니다.
      </p>
      <div class="gray-info-box">
        <ul class="dot-list">
          <li>진료 시간 알림, 복약 시간 알림 등 다양한 서비스를 제공받으실 수 있습니다.</li>
          <li>수신 거부를 원하시면 고객지원 &gt; PUSH 알림에서 수신 OFF 해주세요.</li>
        </ul>
      </div>
    </template>
  </modal-layout>
</template>

<script>
import moment from 'moment';
export default {
  layout: 'none',

  methods: {
    next() {
      this.$router.replace({ name: 'login' });
    },
  },
  created() {
    // console.log(vueMoment().format('MMM Do YY'));
  },
  computed: {
    now() {
      return moment().format('YYYY.MM.DD HH:mm');
    },
  },
};
</script>

<style></style>
