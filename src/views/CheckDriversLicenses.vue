<template>
  <div class="mt-8 flex flex-col">
    <div class="text-4xl text-gray-800 font-bold">Driving License Check</div>
    <div class="text-gray-600">Check user for a valid drivers license.</div>

    <input type="search"
           class="transition-all duration-300 mt-6 rounded-full px-6 py-3 border hover:shadow-lg focus:shadow-lg border-gray-300 bg-white text-lg mb-4"
           placeholder="Enter username here..." v-model="search" @change="searchQuery()">

    <img :src="`${config.backend}/images/${result.owner}/driverslicense.jpg`" alt="Drivers license"
         v-for="(result, i) in results" :key="i" class="rounded-lg">
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import config from '../../config';
import DriversLicense from '@/helpers/interfaces/driversLicense';
import feathersClient from '@/helpers/feathers-client';

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
