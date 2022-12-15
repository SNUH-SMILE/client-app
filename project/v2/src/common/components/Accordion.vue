<template>
  <ul class="acdn-list">
    <li v-for="(item, index) in accordionList" :key="index">
      <button type="button" class="acdn-title" :class="{ selected: visible(index) }" @click="open(index)">
        <span>{{ item.title }}</span>
      </button>
      <transition name="accordion" @enter="start" @after-enter="end" @before-leave="start" @after-leave="end">
        <div v-show="visible(index)" class="acdn-content">
          <p v-html="item.content" />
        </div>
      </transition>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    accordionList: Array,
  },
  data() {
    return {
      targetIndex: null,
    };
  },
  methods: {
    visible(index) {
      return this.targetIndex == index;
    },
    open(index) {
      if (this.visible(index)) {
        this.targetIndex = null;
      } else {
        this.targetIndex = index;
      }
    },
    start(el) {
      el.style.height = el.scrollHeight + 'px';
    },
    end(el) {
      el.style.height = '';
    },
  },
};
</script>

<style></style>
