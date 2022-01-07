<template>
  <div class="p-4 bg-gray-800 text-gray-100">
    <div class="flex justify-between whitespace-nowrap flex-wrap text-sm space-y-2 text-gray-600">
      <router-link
        v-for="(route, i) in $router.options.routes.filter(r => !(exclude.includes(r.path) || (r.path && r.path.includes('admin')) || r.path.includes('businesses')))"
        :key="i" class="mx-2 my-2 hover:text-gray-300 transition-colors cursor-pointer" :to="route.path">
        <span v-if="route.name === 'home'">
          Home
        </span>
        <span v-else>
          {{ route.path.split(':')[0] }}
        </span>
      </router-link>
    </div>

    <!-- Copyright -->
    <div class="flex flex-col items-center">
      <div>© RedwoodRP 2021-{{ year }} — All rights reserved</div>
      <div class="font-medium">DO NOT COPY</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Footer extends Vue {
  private year = 0;
  private exclude = ['*', '/oauth/done', '/error'];

  mounted (): void {
    this.year = new Date().getFullYear();
  }
}
</script>
