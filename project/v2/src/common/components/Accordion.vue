<template>
  <ul class="acdn-list">
    <li v-for="(item, index) in accordionList" :key="index">
      <button type="button" class="acdn-title" :class="{ selected: visible(index) }" @click="open(index)">
        <span>{{ item.title }}</span>
      </button>
      <transition name="accordion" @enter="start" @after-enter="end" @before-leave="start" @after-leave="end">
        <div v-show="visible(index)" class="acdn-content">
          <p>{{ item.content }}</p>
        </div>
      </transition>
    </li>
  </ul>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      accordionList: [
        {
          title: '비대면 진료 솔루션이 실행이 안돼요.',
          content: '답변 내용이 들어갑니다.',
        },
        {
          title: '비대면 진료 시 소리가 안 들려요. 소리가 안 들려요 비대면 진료시. 비대면 진료시 소리가 안 들려요.',
          content: '답변 내용이 들어갑니다.',
        },
        {
          title: '운동은 사람마다 다르게 추천되나요?',
          content:
            '네. ‘운동 전 몸 상태 체크하기’ 결과에 따라 다른 운동이 추천됩니다. 환자분의 몸 상태에 꼭 맞는 강도의 운동을 추천 드리니 꾸준히 실천해보세요!',
        },
      ],
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
