<template>
  <ul class="noti-list">
    <li v-for="(item, index) in notiList" :key="index">
      <button type="button">
        <span class="title-box" :class="{ new: item.new }">
          <span class="ttl" :class="textClass">{{ item.title }}</span>
          <em class="badge">N</em>
        </span>
        <span class="sub-box">
          <span class="date">{{ item.date }}</span>
          <span class="point-txt" v-show="item.answer">답변 완료</span>
        </span>
      </button>
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    notiList: Array,
    textClass: {
      type: String,
      default: '',
    },
  },
};
</script>
