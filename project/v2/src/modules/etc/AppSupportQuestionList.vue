<template>
  <app-notice-list>
    <app-notice-item
      v-for="(item, index) in list"
      @click="onClickItem(item)"
      :key="`sup-notice-${index}`"
      :title="item.questionTitle"
      :date="item.questionDateLabel"
    />
  </app-notice-list>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import { QUESTION_LIST } from '@/modules/etc';
import AppNoticeList from '@/components/AppNoticeList.vue';
import AppNoticeItem from '@/components/AppNoticeItem.vue';

export default {
  components: { AppNoticeList, AppNoticeItem },
  computed: {
    ...mapGetters({
      list: QUESTION_LIST,
    }),
  },

  methods: {
    onClickItem(item) {
      this.$emit('selectedItem', item);
    },
  },
};
</script>
