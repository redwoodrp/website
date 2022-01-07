import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import feathersClient, { AuthObject } from '@/helpers/feathers-client';
import { UserPermissions } from '@/helpers/interfaces/user';
import config from '../../config';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  // Public stuff
  {
    path: '/',
    name: 'home',
    component: Home,
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
    path: '/check/driverslicense',
    name: 'check driverslicense',
    component: () => import('@/views/CheckDriversLicenses.vue'),
    meta: {
      title: 'check driverslicense',
    },
  },
  {
    path: '/invite',
    alias: ['/discord', '/i', '/quickinvite'],
    beforeEnter () {
      window.location.href = 'https://discord.gg/vnk39meb9A';
    },
  },

  // Auth flow
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

  // User related stuff
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
      requiredPermissions: [UserPermissions.ACCESS_TUV_FORM],
      requiresAuth: true,
    },
  },
  {
    path: '/me/forms/driverslicense',
    name: 'me forms driverslicense',
    component: () => import('@/views/me/forms/DriversLicense.vue'),
    meta: {
      title: 'Create drivers license',
      requiresAuth: true,
      requiredPermissions: [UserPermissions.ACCESS_DRIVERS_LICENSE_FORM],
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
      requiredPermissions: [UserPermissions.MANAGE_FORMS],
      requiresAuth: true,
    },
  },

  // Business stuff
  {
    path: '/me/business',
    name: 'business overview',
    component: () => import('@/views/business/Overview.vue'),
    meta: {
      title: 'business dashboard',
      requiredPermissions: [UserPermissions.ACCESS_BUSINESS],
      requiresAuth: true,
    },
  },
  {
    path: '/businesses/apply',
    name: 'business apply',
    redirect: '/error/11001',
    component: () => import('@/views/business/Apply.vue'),
    meta: {
      title: 'business apply',
      requiredPermissions: [UserPermissions.ACCESS_BUSINESS_FORM],
      requiresAuth: true,
    },
  },
  {
    path: '/businesses/sus',
    name: 'business page sus',
    redirect: '/error/11001',
    component: () => import('@/views/business/pages/SUSPerformance.vue'),
    meta: {
      title: 'SUS Performance',
    },
  },

  // Admin stuff
  {
    path: '/admin/tuvs',
    name: 'admin tuvs',
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/admin/Tuvs.vue'),
    meta: {
      title: 'manage TÜVs',
      requiredPermissions: [UserPermissions.MANAGE_TUV_RESPONSES],
      requiresAuth: true,
    },
  },
  {
    path: '/admin/driverslicenses',
    name: 'admin driverslicenses',
    component: () => import('../views/admin/DriversLicenses.vue'),
    meta: {
      title: 'manage drivers licenses',
      requiredPermissions: [UserPermissions.MANAGE_DRIVERS_LICENSE_RESPONSES],
      requiresAuth: true,
    },
  },
  {
    path: '/admin/revokelicenses',
    name: 'admin revokelicenses',
    component: () => import('../views/admin/RevokeDriversLicenses.vue'),
    meta: {
      title: 'revoke drivers licenses',
      requiredPermissions: [UserPermissions.MANAGE_DRIVERS_LICENSE_RESPONSES],
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
    path: '/admin/businesses',
    name: 'admin business application',
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/admin/BusinessApplications.vue'),
    meta: {
      title: 'manage business applications',
      requiredPermissions: [UserPermissions.MANAGE_BUSINESS_RESPONSES],
      requiresAuth: true,
    },
  },

  // Error pages
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
    if (!config.authActive) {
      next({
        path: '/error/11000',
      });
    }

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
        if (!auth.user.permissions.includes(permission as UserPermissions)) {
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
