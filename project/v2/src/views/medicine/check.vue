<template>
  <fragment>
    <div class="content-wrap">
      <div class="content">
        <div class="cont-inner mb-space20 tb-space20">
          <div class="txt-info-box">
            <h2 class="ttl">알림 설정 목록</h2>
            <p class="txt">복약 알림을 설정 하셨나요? <br />클릭만으로 간편하게 <br class="tb-none" />체크해 보세요.</p>
          </div>

          <section class="section-box02" v-for="(item, i) in medicineList" :key="i">
            <h2 class="ttl-b">{{ item.time }}</h2>
            <ul class="medicine-list line-box">
              <li v-for="(subData, index) in item.subData" :key="subData.index">
                <span class="ttl">{{ subData.title }}</span>
                <div class="right-area">
                  <p class="ipt-rdo-txt">
                    <input type="radio" :id="'eatNo' + i + index" :name="'eat' + i + index" />
                    <label :for="'eatNo' + i + index">복욕안함</label>
                    <input type="radio" :id="'eatYes' + i + index" :name="'eat' + i + index" />
                    <label :for="'eatYes' + i + index">복욕함</label>
                  </p>
                </div>
              </li>
            </ul>
          </section>
        </div>
      </div>
      <div class="btn-wrap">
        <router-link custom v-slot="{ navigate }" :to="{ name: 'medicine-no-alarm-check' }">
          <button type="button" class="btn-txt navy" @click="navigate">알림없이 체크하기</button>
        </router-link>
      </div>
    </div>
    <toast text="복약 체크되었습니다." btmClass="is-btm" v-show="toastShow" />
  </fragment>
</template>

<route>
{
  "meta": {
    "title":"복약 체크하기"
  }
}
</route>
<script>
import Toast from '@/common/components/Toast.vue';

const INIT_STATE = () => ({});

export default {
  data() {
    return {
      state: INIT_STATE(),
      toastShow: false,
      medicineList: [
        {
          time: '18:30',
          subData: [
            {
              title: '기침약',
            },
            {
              title: '처방 받은 약',
            },
          ],
        },
        {
          time: '12:30',
          subData: [
            {
              title: '진통제 알람',
            },
          ],
        },
      ],
    };
  },
  components: {
    Toast,
  },
};
</script>

<style></style>
