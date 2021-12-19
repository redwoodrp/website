<template>
  <div id="app">
    <Navbar :items="items" />

    <div class="flex flex-col items-center height mx-3 md:mx-0">
      <router-view
        :class="$route.name === 'admin users' || $route.name === 'admin tuvs' ? 'md:max-w-7/8' : 'md:max-w-2/5 md:w-2/5'"
        class="w-full" />
    </div>

    <Toast ref="toast" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import feathersClient from '@/helpers/feathers-client';
import Toast from '@/components/Toast.vue';
import { UserPermissions } from '@/helpers/interfaces/user';
import Navbar, { NavbarItem } from '@/components/Navbar.vue';

@Component({
  components: {
    Navbar,
    Toast,
  },
})
export default class App extends Vue {
  private feathersClient = feathersClient;
  private items: NavbarItem[] = [
    {
      name: 'About',
      to: '/#about',
      requiredPermissions: [],
      requiresAuth: false,
    },
    {
      name: 'Rules',
      to: '/#rules',
      requiredPermissions: [],
      requiresAuth: false,
    },
    {
      name: 'Dashboard',
      to: '/me',
      requiredPermissions: [],
      requiresAuth: false,
    },
    {
      name: 'TÜV Application',
      to: '/me/forms/tuv',
      requiredPermissions: [UserPermissions.ACCESS_FORM, UserPermissions.CREATE_RESPONSE],
    },
    {
      name: 'My TÜVs',
      to: '/me/tuvs',
      requiredPermissions: [],
    },
    {
      name: 'Check TÜV',
      to: '/check/tuv',
      requiredPermissions: [],
      requiresAuth: false,
    },
    {
      name: 'Manage TÜVs',
      to: '/admin/tuvs',
      requiredPermissions: [UserPermissions.VIEW_FORM_RESPONSES, UserPermissions.MANAGE_FORM_RESPONSES],
    },
    {
      name: 'Manage Users',
      to: '/admin/users',
      requiredPermissions: [UserPermissions.MANAGE_USERS],
    },
    {
      name: 'Feedback',
      to: '/me/feedback',
      requiredPermissions: [],
      requiresAuth: true,
    },
  ];
  private menuOpen = false;
  private showItems = false;

  mounted (): void {
    // Authenticate
    const { hash } = this.$route;

    if (hash && hash.includes('access_token')) {
      feathersClient.authenticate({
          strategy: 'jwt',
          accessToken: hash.split('=')[1],
        })
        .then(() => {
          console.log('[Auth] Successfully Authenticated!');
          this.$router.push('/');
        })
        .catch((e) => {
          console.log('[Auth] Authentication failure: ', e);
        });
    }

    // Register toast global
    const el = (this.$refs.toast as Toast);
    if (!el) return;
    Vue.prototype.$toast = el;
  }
}
</script>

<style scoped lang="scss">
html,
#app,
body {
  scroll-behavior: smooth;
}

.height {
  height: calc(100vh - 65px);
}
</style>
