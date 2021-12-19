import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import feathersClient, { AuthObject } from '@/helpers/feathers-client';
import { UserPermissions } from '@/helpers/interfaces/user';

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
    path: '/login/done',
    name: 'oauth done',
    component: () => import('@/views/oauth/Done.vue'),
  },
  {
    path: '/check/tuv',
    name: 'check tuv',
    component: () => import('@/views/CheckTuvs.vue'),
    meta: {
      title: 'check TÜV',
    },
  },
  {
    path: '/invite',
    alias: ['/discord', '/i', '/quickinvite'],
    beforeEnter () {
      window.location.href = 'https://discord.gg/gV8NbGgw';
    },
  },
  {
    path: '/me',
    name: 'me overview',
    component: () => import('@/views/me/Overview.vue'),
    meta: {
      title: 'user dashboard',
      requiresAuth: true,
    },
  },
  {
    path: '/me/tuvs',
    name: 'tuvs overview',
    component: () => import('@/views/me/MyTuvs.vue'),
    meta: {
      title: 'my TÜVs',
      requiresAuth: true,
    },
  },
  {
    path: '/me/tuvs/:tid',
    name: 'tuvs view specific',
    props: true,
    component: () => import('@/views/me/MyTuvs.vue'),
    meta: {
      title: 'my TÜVs',
      requiresAuth: true,
    },
  },
  {
    path: '/me/forms/tuv',
    name: 'me forms tuv',
    component: () => import('@/views/me/forms/TuvForm.vue'),
    meta: {
      title: 'create TÜV',
      requiredPermissions: [UserPermissions.ACCESS_FORM],
      requiresAuth: true,
    },
  },
  {
    path: '/me/feedback',
    name: 'feedback',
    component: () => import('@/views/me/Feedback.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/admin/forms/builder',
    name: 'form builder',
    component: () => import('@/views/admin/FormBuilder.vue'),
    meta: {
      requiredPermissions: [UserPermissions.ACCESS_FORM],
      requiresAuth: true,
    },
  },
  {
    path: '/admin/tuvs',
    name: 'admin tuvs',
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/admin/Forms.vue'),
    meta: {
      title: 'manage TÜVs',
      requiredPermissions: [UserPermissions.MANAGE_FORM_RESPONSES, UserPermissions.VIEW_FORM_RESPONSES],
      requiresAuth: true,
    },
  },
  {
    path: '/admin/users',
    name: 'admin users',
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/admin/Users.vue'),
    meta: {
      title: 'manage Users',
      requiredPermissions: [UserPermissions.MANAGE_USERS],
      requiresAuth: true,
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

router.beforeEach(async (to, from, next) => {
  if ((to.meta && to.meta.requiresAuth)) {
    await feathersClient.authenticate()
      .then(() => {
        // Success
        console.log('[Auth] Successfully authenticated!');
      })
      .catch(() => {
        // Error
        console.log('[Auth] Not logged in.');
        next({
          path: '/login/',
          query: { redirect: encodeURIComponent(to.path) },
        });
      });
  }

  if (to.meta && to.meta.requiredPermissions) {
    console.log('[Router] Checking access...');
    if (!to.meta.requiresAuth) {
      console.error('Admin pages have to have the meta requiresAuth flag set to true!');
      next({ path: '/error/500' });
      return;
    }

    const auth: AuthObject = await feathersClient.get('authentication');
    if (auth) {
      (to.meta.requiredPermissions as UserPermissions[]).forEach((permission) => {
        if (!(auth.user.permissions as unknown as string).split(',')
          .includes(permission.toString())) {
          console.log((auth.user.permissions as unknown as string).split(','), permission.toString());
          console.log('[Router] 403 Insufficient permissions. Redirecting to error page!');
          next({ path: '/error/403' });
        }
      });
      next();
      return;
    }
    next();
  }
  next();
});

router.afterEach((to) => {
  const capitalize = (s: string) => {
    if (s.length <= 0) return '';
    return s[0].toUpperCase() + s.substr(1);
  };

  Vue.nextTick(() => {
    document.title = `RedwoodRP | ${capitalize(to.meta?.title || to.name || 'Unknown')}`;
  });
});

export default router;
