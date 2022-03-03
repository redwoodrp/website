<template>
  <div class="flex flex-col space-y-4 dark:text-neutral-300">
    <span class="text-gray-400 text-center" v-show="data.length === 0">No results.</span>
    <div class="rounded-2xl border border-gray-300 dark:border-none dark:bg-neutral-800" v-for="tuv in data" :key="tuv.tid">
      <img :src="`${config.backend}/images/${tuv.owner}/${tuv.tid}.jpg`" alt="TÜV Card Image"
           class="rounded-t-2xl">

      <div class="text-xl text-gray-700 font-semibold p-3 dark:text-neutral-300">
        {{
          `${tuv.vehicleBrand} ${tuv.vehicleModel} (${tuv.engineHorsepower} hp; ${tuv.engineCCM} ccm; `
        }}
        <a :href="`/me/tuvs/${tuv.tid}`"
           class="text-blue-500 hover:text-blue-700 transition-all underline">link</a>)
      </div>

      <table class="table-fixed rounded-lg w-full border-none">
        <tbody>
        <tr :class="{'bg-gray-200 dark:bg-neutral-700': i % 2 === 0}" v-for="(val, key, i) in headerMap"
            :key="i" v-show="headerMap[key]">
          <td class="py-1 px-3">{{ val }}</td>
          <td>{{ tuv[key] }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { TuvFormData } from '@/helpers/generic';
import config from '../../config';

@Component
export default class DisplayTuv extends Vue {
  @Prop({ required: true }) private readonly data!: TuvFormData[];
  private config = config;
  private headerMap = {
    additionalInfos: 'Additional Infos',
    bodyType: 'Body',
    engineType: 'Engine',
    firstRegistry: '1st registry',
    fuelType: 'Fuel',
    inspector: 'Inspector',
    licensePlate: 'License Pl.',
    transmission: 'Transmission',
    vehicleColor: 'Color',
    vehicleSeatsAmount: 'Seats',
    vehicleWeight: 'Weight',
    vehicleYear: 'Year',
  };
}
</script>

<style scoped>
table > thead > tr > th,
table > tbody > tr > td {
  @apply border-none rounded-none;
}
</style>
