<template>
  <div class="mt-16 m-auto h-full text-4xl mt-16 text-center text-gray-800 font-medium text-lg">
    <div v-if="!showError">
      <span class="text-4xl font-bold ">Authentication successful</span>
      <span>
      You can close this tab now.
      </span>
    </div>
    <div v-else class="flex flex-col">
      <div class="text-4xl font-bold ">Authentication failed</div>
      <div class="text-lg text-gray-600">
        Something went wrong trying to authenticate you. Please try again!
      </div>
      <div class="rounded-lg bg-gray-700 border-gray-900 border text-gray-200 p-1 text-lg font-normal mt-4" v-if="$route.hash">
        {{ decodeURIComponent($route.hash).split('=')[1] }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Done extends Vue {
  private showError = false;

  mounted (): void {
    const { hash } = this.$route;

    if (hash && hash.includes('access_token')) {
      localStorage.setItem('accessToken', hash.split('=')[1]);
      window.close();
    }

    this.showError = true;
  }
}
</script>
