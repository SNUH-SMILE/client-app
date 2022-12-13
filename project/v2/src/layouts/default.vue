<template>
  <fragment>
    <default-header />
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" :key="$route.fullpath"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" :key="$route.fullpath"></router-view>
  </fragment>
</template>
<script>
import DefaultHeader from '@/components/DefaultHeader.vue';
export default {
  components: {
    DefaultHeader,
  },
};
</script>
