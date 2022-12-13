<template>
  <ul class="sub-info-box">
    <li>
      <p class="ttl">약물 이름</p>
      <div class="right-area">
        <div class="ipt-wrap">
          <text-field class="full" type="text" title="약물 이름" placeholder="입력해 주세요." :value="state.drugName" @input="handleMedicineName" />
        </div>
      </div>
    </li>
    <li>
      <p class="ttl">복용량 <br /><span class="fs-nm">(선택 입력)</span></p>
      <div class="right-area ipt-form">
        <div class="ipt-wrap flex">
          <text-field type="number" title="복용량" placeholder="입력해 주세요." :value="state.drugCount" @input="handleCapaciry" />
        </div>
        <p class="ipt-select">
          <select title="복용량" :value="state.drugType" @change="handleUnit($event)">
            <option v-for="item in drugTypes" :key="`drug-type-${item.value}`" :value="item.value">{{ item.label }}</option>
            <!-- <option value="0">알</option>
            <option value="1">cc</option>
            <option value="2">ml</option>
            <option value="3">mg</option>
            <option value="4">g</option>
            <option value="5">스푼</option>
            <option value="6">포</option> -->
          </select>
        </p>
      </div>
    </li>
  </ul>
</template>
<script>
import { FORM_DRUG_TYPE } from '@/common/constants';
export default {
  name: 'medicine-item',
  props: {
    value: Object,
  },
  data() {
    return {
      state: {
        drugName: this.value.drugName,
        drugCount: this.value.drugCount,
        drugType: this.value.drugType,
      },
      drugTypes: FORM_DRUG_TYPE,
    };
  },
  methods: {
    handleMedicineName(value) {
      this.state.drugName = value;
      this.handleInput();
    },
    handleCapaciry(value) {
      this.state.drugCount = value;
      this.handleInput();
    },
    handleUnit(e) {
      this.state.drugType = e.target.value;
      this.handleInput();
    },
    handleInput() {
      this.$emit('input', this.state);
    },
  },
};
</script>
