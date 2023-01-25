<template>
  <section class="section-box">
    <div class="section-ttl-box">
      <h2 class="section-ttl">문진하기</h2>
      <router-link custom v-slot="{ navigate }" :to="{ name: 'history-taking' }">
        <button type="button" class="btn-ic-txt arrow" @click="navigate">바로가기</button>
      </router-link>
    </div>
    <!-- yesdata -->
    <ul class="question-list" v-if="interviewList.length > 0">
      <li v-for="(item, index) in interviewList" :key="`question-${index}`">
        <button type="button" :disabled="item.interviewStatus !== '0'">
          <span class="ttl">{{ item.interviewTitle }}</span>
          <span class="lb-rnd-txt" @click="handleInterview(item)">
            <template v-if="item.interviewStatus === '0'">작성하기</template>
            <template v-else-if="item.interviewStatus === '1'">작성예정</template>
            <template v-else-if="item.interviewStatus === '2'">작성불가</template>
            <template v-else-if="item.interviewStatus === '3'">작성완료</template>
          </span>
        </button>
      </li>
    </ul>

    <!-- nodata -->
    <div class="nodata-box" v-else>
      <p>작성하실 문진이 없습니다.</p>
    </div>
  </section>
</template>

<script>
import { ENUM_DATE_FORMAT } from '@/common/constants';
import { mapActions, mapGetters } from 'vuex';
import { GET_INTERVIEW_LIST } from '../history';
export default {
  async created() {
    this.fetchList(this.$dayjs().format(ENUM_DATE_FORMAT.YMD));
  },
  computed: {
    ...mapGetters({ interviewList: GET_INTERVIEW_LIST }),
  },
  methods: {
    ...mapActions({ fetchList: GET_INTERVIEW_LIST }),
    handleInterview({ interviewStatus, interviewType }) {
      if (interviewStatus === '0') {
        this.$eventBus.$emit('writeInterview', interviewType);
      }
    },
  },
};
</script>

<style></style>
