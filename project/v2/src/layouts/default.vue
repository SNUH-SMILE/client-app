<template>
  <div style="display: contents">
    <default-header />
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" :key="$route.fullpath"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" :key="$route.fullpath"></router-view>
  </div>
</template>
<script>
import DefaultHeader from '@/components/DefaultHeader.vue';
export default {
  components: {
    DefaultHeader,
  },
};
</script>
