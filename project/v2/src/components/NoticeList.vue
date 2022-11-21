<template>
  <ul class="noti-list">
    <li v-for="(item, index) in list" :key="`${item.noticeTitle}-${index}`">
      <button type="button">
        <span class="title-box" :class="{ new: true }">
          <span class="ttl" :class="textClass">{{ item.noticeTitle }}</span>
          <em class="badge">N</em>
        </span>
        <span class="sub-box">
          <span class="date">{{ item.noticeDate }}</span>
        </span>
      </button>
    </li>
  </ul>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import { NOTICE_LIST } from '@/modules/etc';
export default {
  props: {
    notiList: Array,
    textClass: {
      type: String,
      default: '',
    },
  },
  created() {
    this.fetchList();
  },
  computed: {
    ...mapGetters({
      list: NOTICE_LIST,
    }),
  },

  methods: {
    ...mapActions({
      fetchList: NOTICE_LIST,
    }),
  },
};
</script>
