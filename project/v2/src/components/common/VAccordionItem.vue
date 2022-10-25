<template>
  <li>
    <button type="button" class="acdn-title" :class="{ selected: visible }" @click="visible = !visible">
      <span><slot name="title"></slot></span>
    </button>
    <transition name="accordion" @enter="start" @after-enter="end" @before-leave="start" @after-leave="end">
      <div v-show="visible" class="acdn-content">
        <p><slot name="content"></slot></p>
      </div>
    </transition>
  </li>
</template>

<script>
export default {
  props: {
    selected: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
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
