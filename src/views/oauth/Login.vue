<template>
  <div class="h-full flex items-center justify-center">
    <div class="flex flex-col items-center justify-center space-y-3">
      <span class="font-bold text-gray-700 dark:text-neutral-300 text-3xl">Login with Discord</span>
      <button class="btn bg-blue-600 hover:bg-blue-900" @click="performLogin">
        Bring me to Discord
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import feathersClient from '@/helpers/feathers-client';
import config from '../../../config';

@Component
export default class Login extends Vue {
  private feathersClient = feathersClient; // only for debugging
  private authenticated = false;
  private interval: number | null = null;

  mounted (): void {
    const { hash } = this.$route;
    console.log(this.$route, hash);
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
  }

  tryAuthenticateFromStorage (): void {
    if (localStorage.getItem('accessToken') === null) return;
    feathersClient.authenticate({
        strategy: 'jwt',
        accessToken: localStorage.getItem('accessToken'),
      })
      .then(() => {
        console.log('[Auth] Successfully Authenticated!');
        localStorage.removeItem('accessToken');

        this.authenticated = true;

        if (this.interval) clearInterval(this.interval);

        if (this.$route.query && this.$route.query.redirect) {
          window.location.href = decodeURIComponent(this.$route.query.redirect as string);
          return;
        }
        window.location.href = '/';
      })
      .catch((e) => {
        console.log('[Auth] Authentication failure: ', e);
      });
  }

  performLogin (): void {
    const win = window.open(`${config.backend}/oauth/discord`);
    if (!win) return;
    win.addEventListener('blur', () => {
      this.tryAuthenticateFromStorage();
    });

    this.interval = setInterval(this.tryAuthenticateFromStorage, 1500) as unknown as number;
  }
}
</script>
