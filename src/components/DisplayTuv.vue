<template>
  <div class="flex flex-col space-y-4">
    <span class="text-gray-400 text-center" v-show="data.length === 0">No results.</span>
    <div class="rounded-2xl border border-gray-300" v-for="tuv in data" :key="tuv.tid">
      <img :src="`${config.backend}/images/${tuv.owner}/${tuv.tid}.jpg`" alt="TÜV Card Image"
           class="rounded-t-2xl">

      <div class="text-xl text-gray-700 font-semibold p-3">
        {{
          `${tuv.vehicleBrand} ${tuv.vehicleModel} (${tuv.engineHorsepower} hp; ${tuv.engineCCM} ccm; `
        }}
        <a :href="`/me/tuvs/${tuv.tid}`"
           class="text-blue-500 hover:text-blue-700 transition-all underline">link</a>)
      </div>

      <div class="mx-3 mb-3 flex flex-row justify-between">
        <div>
          <div v-for="(category, i) in Object.keys(tuv)" :key="i">
              <span>{{
                  Object.keys(headerMap)[Object.values(headerMap)
                                               .findIndex(c => c === category)]
                }}</span>
          </div>
        </div>

        <div>
          <div v-for="(category, i) in Object.keys(tuv)" :key="i">
              <span v-show="Object.values(headerMap).includes(category)">{{
                  tuv[Object.values(headerMap)
                            .find((c) => c === category)]
                }}</span>
          </div>
        </div>
      </div>
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
    'License Pl.': 'licensePlate',
    '1st registry': 'firstRegistry',
    Engine: 'engineType',
    Fuel: 'fuelType',
    Transmission: 'transmission',
    Body: 'bodyType',
    Color: 'vehicleColor',
    Weight: 'vehicleWeight',
    Seats: 'vehicleSeatsAmount',
    Year: 'vehicleYear',
    'Additional Infos': 'additionalInfos',
    Inspector: 'inspector',
  };
}
</script>
