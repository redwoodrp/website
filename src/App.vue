<template>
  <div id="app">
    <ul
      class="bg-gray-800 rounded-b-lg h-16 shadow-2xl font-medium text-gray-200 text-lg px-4 flex flex-row items-center nav">
      <li class="text-gray-100 font-bold">RedwoodAdmin</li>
      <li>Approve</li>
      <li>Approved</li>
      <li>Overview</li>
      <li>All</li>
      <li>Check</li>
    </ul>

    <div class="flex flex-col items-center max-w-full height">
      <router-view />
    </div>

    <Toast ref="toast" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import feathersClient from '@/helpers/feathers-client';
import Toast from '@/components/Toast.vue';

@Component({
  components: {
    Toast,
  },
})
export default class App extends Vue {
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
}
</script>

<style scoped lang="scss">
html,
#app,
body {
  scroll-behavior: smooth;
}

.nav > *:not(:last-child):after {
  content: "|";
  @apply text-gray-400 font-bold mx-6;
}

.height {
  height: calc(100vh - 65px);
}
</style>
