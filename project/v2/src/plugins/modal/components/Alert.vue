<template>
  <transition name="fade" appear>
    <div class="popup-wrap show">
      <div class="popup-bg"></div>
      <div class="popup popup-mid">
        <div class="popup-box">
          <div class="pop-head">
            <slot name="head">
              <strong class="pop-ttl" v-html="title"></strong>
            </slot>
          </div>
          <div class="pop-body" v-html="content"></div>
          <div class="pop-foot">
            <slot name="foot">
              <div class="btn-wrap">
                <button type="button" class="btn-txt blue" @click="onAction('submit')">확인</button>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  data() {
    return {
      title: '',
      content: '',
    };
  },
};
</script>
