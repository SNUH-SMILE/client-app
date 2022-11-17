<template>
  <div class="content-wrap">
    <validation-observer tag="fragment">
      <div class="content">
        <div class="cont-inner pt0 tb-w100p">
          <ul class="md-set-list">
            <li>
              <div class="hbox jc">
                <p class="ttl">복용 시작일</p>
                <div class="right-area">
                  <strong class="txt txtc-blue">{{ date }}</strong>
                </div>
              </div>
            </li>
            <li>
              <div class="hbox jc">
                <p class="ttl">복용 일수</p>
                <div class="right-area">
                  <p class="ipt-select">
                    <select title="복용 일수" name="noticeDate">
                      <option value="1">1일</option>
                      <option value="2">2일</option>
                      <option value="3">3일</option>
                      <option value="4">4일</option>
                      <option value="5">5일</option>
                      <option value="6">6일</option>
                      <option value="7">7일</option>
                    </select>
                  </p>
                </div>
              </div>
            </li>
            <li>
              <div class="hbox jc">
                <p class="ttl">알림 이름 <br /><span class="fs-nm">(필수 입력)</span></p>
                <div class="right-area">
                  <div class="ipt-wrap">
                    <text-field type="text" title="약물 이름" placeholder="입력해 주세요." v-model="alarmName" />
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div class="hbox jc">
                <p class="ttl">약물 정보 <br /><span class="fs-nm">(선택 입력)</span></p>
                <div class="right-area">
                  <button type="button" class="btn-line-rnd" @click="addMedicine">추가</button>
                </div>
              </div>
              <medicine-item v-for="(item, index) in medicineList" :key="index" v-model="medicineList[index]" />
            </li>
            <li>
              <div class="hbox jc">
                <p class="ttl">알림 시간</p>
                <div class="right-area">
                  <button type="button" class="btn-line-rnd" @click="addAlarm">추가</button>
                </div>
              </div>
              <ul class="sub-info-box">
                <medicine-alarm v-for="(item, index) in alarmList" :key="index" v-model="alarmList[index].time" />
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <div class="btn-wrap">
        <router-link custom v-slot="{ navigate }" :to="{ name: 'medicine' }">
          <button type="button" class="btn-txt navy" @click="navigate" :disabled="!isActiveSaveButton">저장</button>
        </router-link>
      </div>
    </validation-observer>
  </div>
</template>
<route>
{
  "meta": {
    "title": "복약 알림 설정"
  }
}
</route>
<script>
import insertService from '@/services/native/db.js';
import MedicineItem from '@/components/MedicineItem.vue';
import MedicineAlarm from '@/components/MedicineAlarm.vue';

const QUERY_DB_CB_NM = '__queryDBcb';
window[QUERY_DB_CB_NM] = (...args) => {
  console.log(...args);
};
const medicineItemForm = () => ({
  medicineName: '',
  capacity: '',
  unit: '',
});

export default {
  components: {
    MedicineItem,
    MedicineAlarm,
  },
  data() {
    return {
      alarmName: '',
      date: this.$dayjs().format('YYYY.MM.DD'),
      medicineList: [],
      alarmList: [],
      toastShow: false,
    };
  },
  methods: {
    showModal() {
      this.$eventBus.$emit('openTimePicker');
    },
    showToast() {
      this.$toast({ text: '알림 설정 내용이 저장되었습니다.' });
    },
    submit() {
      this.showToast();
    },
    addMedicine() {
      this.medicineList.push(medicineItemForm());
    },
    addAlarm() {
      this.alarmList.push({ time: this.$dayjs().format('hh mm') });
    },
    submitAlarmTime(value) {
      console.log(value);
    },
  },
  computed: {
    isActiveSaveButton() {
      return this.alarmName.length > 0;
    },
  },
  created() {
    /**
     * 만약, Slot 사용 여부에 따라서 핸들링시  아래의 로직을 Header컴포넌트로 이동
     */
    this.$eventBus.$emit('setWarpClass', 'pg-fp');
    // insertService({ type: 'medicine', time: '20221102 1503', seq: 'self00001' }, QUERY_DB_CB_NM);
  },
  beforeDestroy() {
    this.$eventBus.$emit('setWarpClass', '');
  },
  beforeRouteLeave(to, from, next) {
    next();
  },
};
</script>

<style></style>
