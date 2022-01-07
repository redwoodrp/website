<template>
  <div class="flex justify-center w-full" v-if="show">
    <div
      class="fixed bottom-0 mb-4 p-4 bg text-white flex flex-row items-center space-x-4 rounded-lg shadow-lg w-1/2 bg-opacity-60">
      <div>
        <div class="text-lg font-semibold">We DON'T use cookies.</div>
        <div class="text-gray-500">
          We do not use any cookies to track your behaviour on this
          website. We only use necessary cookies for our site to work properly. Any questions? DM
          JustMe#8491 on Discord!
        </div>
      </div>

      <button class="btn bg-green-600 hover:bg-green-900" @click="acceptNotice">
        Accept
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class CookieNotice extends Vue {
  private key = 'user-knows-that-we-dont-use-cookies';
  private show = false;

  mounted (): void {
    this.show = localStorage.getItem(this.key) !== 'true';
  }

  acceptNotice (): void {
    localStorage.setItem(this.key, 'true');
    this.show = false;
  }
}
</script>

<style scoped>
.bg {
  background: rgb(24, 26, 28);
}
</style>
