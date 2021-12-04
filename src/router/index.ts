import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import feathersClient, { AuthObject } from '@/helpers/feathers-client';
import User, { UserPermissions } from '@/helpers/interfaces/user';

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
      requiredPermissions: [UserPermissions.ACCESS_FORM],
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
    path: '/admin/dashboard',
    name: 'dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/admin/dashboard/Overview.vue'),
    meta: {
      requiredPermissions: [UserPermissions.MANAGE_FORM_RESPONSES, UserPermissions.VIEW_FORM_RESPONSES],
      requiresAuth: true,
    },
  },
  {
    path: '/admin/users',
    name: 'admin users',
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/admin/Users.vue'),
    meta: {
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
        if (!(auth.user.permissions as unknown as string).split(',').includes(permission.toString())) {
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

export default router;
