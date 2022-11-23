<template>
  <modal-layout title="앱 PUSH 알림 거부" @onSubmit="next" bodyClass="pb0">
    <template slot="body">
      <p class="pop-txt">
        {{ now }} 알림 수신
        <br />
        <strong class="iht">&lsquo;거부&rsquo;</strong> 되었습니다.
      </p>
      <div class="gray-info-box">
        <ul class="dot-list">
          <li>진료 시간 알림, 복약 시간 알림 등 모든 서비스에 대하여 알림 서비스가 중단 됩니다.</li>
          <li>수신을 원하시면 고객지원 &gt; PUSH 알림에서 수신 <strong class="iht txtc-blue">ON</strong> 해주세요.</li>
        </ul>
      </div>
    </template>
  </modal-layout>
</template>

<script>
export default {
  layout: 'none',
  methods: {
    next() {
      this.$router.replace({ name: 'login' });
    },
  },
  computed: {
    now() {
      return this.$dayjs().format('YYYY.MM.DD HH:MM');
    },
  },
};
</script>

<style></style>
