import Vue from 'vue';
import Router from 'vue-router';
import routes from 'vue-auto-routing';
import { createRouterLayout } from 'vue-router-layout';
import PageMiddleware from '@/middlewares/page';
import VueLogger from '@/utils/logger';
Vue.use(Router);
const logger = new VueLogger('router');
const RouterLayout = createRouterLayout((layout) => {
  return import('@/layouts/' + layout + '.vue');
});

// routes.forEach((route) => {
//   if (route.name === 'home') {
//     route.components = {
//       default: route.component,
//       header: { template: '<h1>test</h1>' },
//     };
//     delete route.component;
//   }
// });
logger.log(routes);
const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savePosition) {
    // scroll 관련 함수
    // console.log(savePosition);
  },
  routes: [
    {
      path: '*',
      redirect: '/',
    },
    {
      path: '/',
      redirect: '/intro',
    },
    {
      path: '/',
      component: RouterLayout,
      children: routes,
    },
  ],
});

router.beforeEach((to, from, next) => {
  PageMiddleware(to, from);
  next();
});

export default router;
