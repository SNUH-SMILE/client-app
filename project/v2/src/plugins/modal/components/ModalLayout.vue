<template>
  <transition name="fade" appear v-if="show">
    <div class="popup-wrap show">
      <div class="popup-bg"></div>
      <div class="popup" :class="layoutClass">
        <div class="popup-box">
          <div class="pop-head">
            <slot name="head">
              <strong class="pop-ttl">{{ title }}</strong>
            </slot>
          </div>
          <div class="pop-body" :class="bodyClass">
            <slot name="body"></slot>
          </div>
          <div class="pop-foot">
            <slot name="foot">
              <div class="btn-wrap">
                <button type="button" class="btn-txt" :class="[layoutClass == 'popup-mid' ? 'blue' : 'navy']" @click="onSubmit">확인</button>
              </div>
            </slot>
          </div>
        </div>
        <slot name="noti" />
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    title: String,
    bodyClass: {
      type: String,
      default: '',
    },
    layoutClass: {
      type: String,
      default: 'popup-mid',
    },
  },
  data() {
    return {
      show: true,
    };
  },
  methods: {
    onSubmit(action) {
      this.show = false;
      this.$nextTick(() => {
        this.$emit('onSubmit', action);
      });
    },
  },
};
</script>
