<template>
  <div class="mt-8 flex flex-col">
    <div class="text-4xl text-gray-800 font-bold dark:text-neutral-300">Driving License Check</div>
    <div class="text-gray-600 dark:text-neutral-500">Check user for a valid drivers license.</div>

    <input type="search"
           class="round-text-input"
           placeholder="Enter username here..." v-model="search" @change="searchQuery()">

    <img :src="`${config.backend}/images/${result.owner}/driverslicense.jpg`" alt="Drivers license"
         v-for="(result, i) in results" :key="i" class="rounded-lg mb-4">
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DriversLicense from '@/helpers/interfaces/driversLicense';
import feathersClient from '@/helpers/feathers-client';
import config from '../../config';

@Component
export default class CheckDriversLicenses extends Vue {
  private results: DriversLicense[] = [];
  private search = '';
  private config = config;

  private async mounted (): Promise<void> {
    await this.searchQuery();
  }

  private async searchQuery (): Promise<void> {
    this.results = await feathersClient.service('drivers-license')
      .find({
        query: {
          discordName: {
            $like: `%${this.search}%`,
          },
        },
      });
  }
}
</script>
