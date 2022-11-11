<template>
  <ul class="sub-info-box">
    <li>
      <p class="ttl">약물 이름</p>
      <div class="right-area">
        <div class="ipt-wrap">
          <text-field type="text" title="약물 이름" placeholder="입력해 주세요." :value="value.medicineName" @input="handleMedicineName" />
        </div>
      </div>
    </li>
    <li>
      <p class="ttl">복용량 <br /><span class="fs-nm">(선택 입력)</span></p>
      <div class="right-area ipt-form">
        <div class="ipt-wrap flex">
          <text-field type="number" title="복용량" placeholder="입력해 주세요." :value="value.capacity" @input="handleCapaciry" />
        </div>
        <p class="ipt-select">
          <select title="복용량" :value="value.unit" @change="handleUnit($event)">
            <option value="0">알</option>
            <option value="1">cc</option>
            <option value="2">ml</option>
            <option value="3">mg</option>
            <option value="4">g</option>
            <option value="5">스푼</option>
            <option value="6">포</option>
          </select>
        </p>
      </div>
    </li>
  </ul>
</template>
<script>
export default {
  name: 'medicine-item',
  props: {
    value: Object,
  },
  data() {
    return {
      medicineItem: {
        medicineName: this.value.medicineName,
        capacity: this.value.capacity,
        unit: this.value.unit,
      },
    };
  },
  methods: {
    handleMedicineName(value) {
      this.medicineItem.medicineName = value;
      this.handleInput();
    },
    handleCapaciry(value) {
      this.medicineItem.capacity = value;
      this.handleInput();
    },
    handleUnit(e) {
      this.medicineItem.unit = e.target.value;
      this.handleInput();
    },
    handleInput() {
      this.$emit('input', this.medicineItem);
    },
  },
};
</script>
