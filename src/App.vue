<template>
  <div id="app">
    <Navbar :items="items" />

    <div class="flex flex-col items-center height mx-3 md:mx-0">
      <router-view
        :class="getContainerWidth()"
        class="w-full" />
    </div>

    <Footer></Footer>

    <Toast ref="toast" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import feathersClient from '@/helpers/feathers-client';
import Toast from '@/components/Toast.vue';
import { UserPermissions } from '@/helpers/interfaces/user';
import Navbar, { NavbarItem } from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';

@Component({
  components: {
    Navbar,
    Footer,
    Toast,
  },
})
export default class App extends Vue {
  private items: NavbarItem[] = [
    {
      name: 'Dashboard',
      to: '/me',
      requiredPermissions: [],
      requiresAuth: false,
    },
    {
      name: 'TÜV Form',
      to: '/me/forms/tuv',
      requiredPermissions: [UserPermissions.ACCESS_TUV_FORM],
    },
    {
      name: 'Check TÜV',
      to: '/check/tuv',
      requiredPermissions: [],
      requiresAuth: false,
    },
    {
      name: 'Check Driverslicense',
      to: '/check/driverslicense',
      requiredPermissions: [],
      requiresAuth: false,
    },
    {
      name: 'Manage TÜVs',
      to: '/admin/tuvs',
      requiredPermissions: [UserPermissions.MANAGE_TUV_RESPONSES],
    },
    {
      name: 'Manage Users',
      to: '/admin/users',
      requiredPermissions: [UserPermissions.MANAGE_USERS],
    },
  ];
  private feathersClient = feathersClient;

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

  private getContainerWidth (): string {
    if (this.$route.name === 'home') return '';
    if (this.$route.name === 'admin users' || this.$route.name === 'admin tuvs') return 'md:max-w-7/8';

    return 'md:max-w-3/4 md:w-3/4 lg:max-w-7/12 lg:w-7/12 2xl:max-w-2/5 2xl:w-2/5';
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
