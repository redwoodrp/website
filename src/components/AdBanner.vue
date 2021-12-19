<template>
  <div
    class="transition-all transform hover:scale-105 mt-16 rounded-lg border border-gray-200 shadow-lg h-48 cursor-pointer hover:shadow-xl flex flex-row space-x-2 text-gray-800 relative"
    v-if="ad.show">
    <img
      :src="ad.imageSource"
      class="h-48 rounded-l-lg" alt="Advertisement">
    <div class="p-1">
      <div class="text-2xl font-semibold">{{ ad.title }}</div>
      <div class="text-sm text-gray-600">
        {{ ad.description }}
      </div>

      <div class="text-xs text-gray-400 bottom-0 -ml-1 mb-0.5 absolute">
        This ad is fake and was paid with fake money.
        If this ad contains inappropriate content please contact me JustMe#8491 on Discord.
        <router-link class="underline transition-colors hover:text-gray-600" to="/legal/ads">Learn more</router-link>
      </div>
    </div>

    <button
      class="absolute top-0 right-0 text-gray-400 mt-1 right-px hover:bg-red-500 transition-all rounded-lg hover:text-white"
      @click="ad.show = false">
      <svg style="width:24px;height:24px" viewBox="0 0 24 24">
        <path fill="currentColor"
              d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z" />
      </svg>
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Ad } from '@/helpers/generic';

@Component
export default class AdBanner extends Vue {
  private ad: Ad = {
    show: false,
    business: 10001,
    to: '/business/fandf',
    imageSource: 'http://localhost:3030/images/414585685895282701/7712ab93-9484-43c0-9e1b-e332f41fe2cc.jpg',
    title: 'F&F Auto Insurance',
    description: 'You want a quality insurance for a lower fee than other, less reliable companies? Then\n'
      + 'get F&F Auto Insurance today! We provide easy ways for you to quickly make sure you\n'
      + 'don\'t have to pay a dime when you crash!',
  };
}
</script>
