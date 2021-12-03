import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import feathersClient from '@/helpers/feathers-client';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/oauth/Login.vue'),
  },
  {
    path: '/oauth/done',
    name: 'oauth done',
    component: () => import('@/views/oauth/Done.vue'),
  },
  {
    path: '/me',
    name: 'me overview',
    component: () => import('@/views/me/Overview.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/me/forms/tuv',
    name: 'me forms tuv',
    component: () => import('@/views/me/forms/TuvForm.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/admin/forms/builder',
    name: 'form builder',
    component: () => import('@/views/me/forms/FormBuilder.vue'),
    meta: {
      adminOnly: true,
      requiresAuth: true,
    },
  },
  {
    path: '/admin/dashboard',
    name: 'dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard/Overview.vue'),
    meta: {
      adminOnly: true,
    },
  },
  {
    path: '/error/:code',
    name: 'error',
    props: true,
    component: () => import('@/views/Error.vue'),
  },
  {
    path: '*',
    redirect: '/error/404',
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

const isAdmin = true;

router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.requiresAuth) {
      feathersClient.authenticate().then(() => {
        // Success
        console.log('[Auth] Successfully authenticated!');
      }).catch(() => {
        // Error
        console.log('[Auth] Not logged in.');
        next({ path: '/login/', query: { redirect: encodeURIComponent(to.path) } });
      });
  }

  if (to.matched.some((record) => record.meta.adminOnly)) {
    console.log('[Router] Admin only page. Checking access');

    if (!isAdmin) {
      console.log('[Router] 403 Insufficient permissions. Redirecting to error page!');
      next({ path: '/error/403' });
    }
    next();
  }
  next();
});

export default router;
