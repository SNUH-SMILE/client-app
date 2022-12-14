<template>
  <section class="section-box">
    <div class="section-ttl-box">
      <h2 class="section-ttl">건강상태</h2>
      <button type="button" class="btn-ic-txt refresh" @click="refetch">새로고침</button>
    </div>
    <ul class="health-list">
      <li>
        <router-link custom v-slot="{ navigate }" :to="{ name: 'state-blood' }">
          <button type="button" @click="navigate">
            <span class="health-list-ttl ic-blood">혈압</span>
            <!-- yesdata -->
            <span class="data" v-if="toggles.bp"
              ><strong class="num">{{ datas.bp.sbp }}/{{ datas.bp.dbp }}</strong> mmHg</span
            >
            <!-- nodata -->
            <span class="txtc-gray" v-else>오늘은 측정된 정보가 없습니다.</span>
          </button>
        </router-link>
      </li>
      <li>
        <router-link custom v-slot="{ navigate }" :to="{ name: 'state-heart' }">
          <button type="button" @click="navigate">
            <span class="health-list-ttl ic-heart">심박수</span>
            <!-- yesdata -->
            <span class="data" v-if="toggles.hr">
              <strong class="num">{{ datas.hr.hr }}</strong> 회/분
            </span>
            <!-- nodata -->
            <span class="txtc-gray" v-else>오늘은 측정된 정보가 없습니다.</span>
          </button>
        </router-link>
      </li>

      <li>
        <router-link custom v-slot="{ navigate }" :to="{ name: 'state-step' }">
          <button type="button" @click="navigate">
            <span class="health-list-ttl ic-walk">걸음수</span>
            <!-- yesdata -->
            <span class="data" v-if="toggles.step"
              ><strong class="num">{{ datas.step.todayCount }}</strong> 걸음</span
            >
            <!-- nodata -->
            <span class="txtc-gray" v-else>오늘은 측정된 정보가 없습니다.</span>
          </button>
        </router-link>
      </li>
      <li>
        <router-link custom v-slot="{ navigate }" :to="{ name: 'state-sleep' }">
          <button type="button" @click="navigate">
            <span class="health-list-ttl ic-sleep">수면</span>
            <!-- yesdata -->
            <span class="data" v-if="toggles.sleep"
              ><strong class="num">{{ datas.sleep.hh }}</strong
              >시간 <strong class="num">{{ datas.sleep.mm }}</strong
              >분</span
            >
            <!-- nodata -->
            <span class="txtc-gray" v-else>오늘은 측정된 정보가 없습니다.</span>
          </button>
        </router-link>
      </li>
      <li>
        <router-link custom v-slot="{ navigate }" :to="{ name: 'state-temper' }">
          <button type="button" @click="navigate">
            <span class="health-list-ttl ic-temp">체온</span>
            <!-- yesdata -->
            <span class="data" v-if="toggles.bt"
              ><strong class="num">{{ datas.bt.bt }}</strong> ℃</span
            >
            <!-- nodata -->
            <span class="txtc-gray" v-else>오늘은 측정된 정보가 없습니다.</span>
          </button>
        </router-link>
      </li>
      <li>
        <router-link custom v-slot="{ navigate }" :to="{ name: 'state-respiration' }">
          <button type="button" @click="navigate">
            <span class="health-list-ttl ic-oxygen">호흡수</span>
            <!-- yesdata -->
            <span class="data" v-if="toggles.rr"
              ><strong class="num">{{ datas.rr.rr }}</strong> 회/분</span
            >
            <!-- nodata -->
            <span class="txtc-gray" v-else>오늘은 측정된 정보가 없습니다.</span>
          </button>
        </router-link>
      </li>
      <li>
        <router-link custom v-slot="{ navigate }" :to="{ name: 'state-oxygen' }">
          <button type="button" @click="navigate">
            <span class="health-list-ttl ic-oxygen">산소포화도</span>
            <!-- yesdata -->
            <span class="data" v-if="toggles.o2"
              ><strong class="num">{{ datas.o2.spO2 }}</strong> %</span
            >
            <!-- nodata -->
            <span class="txtc-gray" v-else>오늘은 측정된 정보가 없습니다.</span>
          </button>
        </router-link>
      </li>
    </ul>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { MAIN_CONTENT, MAIN_HEALTHS } from '.';
export default {
  name: 'app-home-healths',
  computed: {
    ...mapGetters({ healths: MAIN_HEALTHS }),
    toggles: function () {
      return this.healths.toggles;
    },
    datas: function () {
      return this.healths.datas;
    },
  },
  methods: {
    ...mapActions({ refetch: MAIN_CONTENT }),
  },
};
</script>

<style></style>
