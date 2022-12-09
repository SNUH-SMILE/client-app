<template>
  <modal-layout layoutClass="popup-btm">
    <template slot="head">
      <button type="button" class="btn-pop-close" @click="$emit('onClose')">
        <span class="txt-blind">팝업닫기</span>
      </button>
    </template>
    <template slot="body">
      <div class="list-select-wrap">
        <p class="list-select-title">
          <span>시</span>
          <span>분</span>
        </p>
        <div class="list-select-time" ref="listSelectTime"></div>
      </div>
    </template>
    <template slot="foot">
      <div class="btn-wrap">
        <button type="button" class="btn-txt navy" @click="onSubmit">확인</button>
      </div>
    </template>
  </modal-layout>
</template>
<script>
import ModalLayout from '@/plugins/modal/components/ModalLayout.vue';
export default {
  components: {
    ModalLayout,
  },
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      hour: '00',
      minute: '00',
    };
  },
  mounted() {
    this.hour = this.value.substring(0, 2);
    this.minute = this.value.substring(3, 5);
    $(this.$refs.listSelectTime)
      .mobiscroll()
      .scroller({
        mode: 'scroller', // Specify scroller mode like: mode: 'mixed' or omit setting to use default
        display: 'inline',
        lang: 'ko',
        height: 52,
        wheels: [
          [
            {
              keys: [
                '00',
                '01',
                '02',
                '03',
                '04',
                '05',
                '06',
                '07',
                '08',
                '09',
                '10',
                '11',
                '12',
                '13',
                '14',
                '15',
                '16',
                '17',
                '18',
                '19',
                '21',
                '22',
                '23',
              ],
              values: [
                '00',
                '01',
                '02',
                '03',
                '04',
                '05',
                '06',
                '07',
                '08',
                '09',
                '10',
                '11',
                '12',
                '13',
                '14',
                '15',
                '16',
                '17',
                '18',
                '19',
                '21',
                '22',
                '23',
              ],
              defaultValue: '21',
            },
            {
              keys: ['00', '10', '20', '30', '40', '50'],
              values: ['00', '10', '20', '30', '40', '50'],
            },
          ],
        ],
        parseValue: () => {
          return [`${this.hour}`, `${this.minute}`];
        },
        rows: 3,
      });
  },
  beforeDestroy() {
    // component가 파괴될떄, window에 걸은 이벤트는 해제한다.
  },
  methods: {
    onSubmit() {
      const newValue = $(this.$refs.listSelectTime).mobiscroll('getVal') || this.value;
      this.$emit('input', newValue.replace(' ', ':'));
      this.$emit('onClose');
    },
  },
};
</script>

<style></style>
