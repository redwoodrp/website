<template>
  <div class="w-2/5 flex justify-center flex-col mt-8">
    <div class="text-5xl text-gray-800 font-bold">My TÜVs</div>
    <input type="search"
           class="transition-all duration-300 mt-6 rounded-full px-6 py-3 border hover:shadow-lg focus:shadow-lg border-gray-300 bg-white text-lg mb-4"
           placeholder="Search..." v-model="search" @change="searchQuery">
    <div class="flex flex-col space-y-4">
      <span class="text-gray-400 text-center" v-show="tuvs.length === 0">No results.</span>
      <div class="rounded-2xl border border-gray-300" v-for="tuv in tuvs" :key="tuv.tid">
        <img :src="`${config.backend}/images/${tuv.owner}/${tuv.tid}.jpg`" alt="TÜV Card Image"
             class="rounded-t-2xl">

        <div class="text-xl text-gray-700 font-semibold p-3">
          {{
            `${tuv.vehicleBrand} ${tuv.vehicleModel} (${tuv.engineHorsepower} hp; ${tuv.engineCCM} ccm)`
          }}
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import feathersClient from '@/helpers/feathers-client';
import { TuvFormData } from '@/helpers/generic';
import User from '@/helpers/interfaces/user';
import config from '../../../config';

@Component
export default class Tuvs extends Vue {
  private search = '';
  private tuvs: TuvFormData[] = [];
  private user: User | null = null;
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

  async mounted (): Promise<void> {
    this.user = await feathersClient.get('authentication');

    await this.searchQuery();
  }

  private async searchQuery (): Promise<void> {
    if (!this.user) return;

    const q = `%${this.search}%`;
    const res = await feathersClient.service('tuv-forms')
      .find({
        query: {
          owner: this.user.discordId,
          approved: true,
          $or: {
            vehicleModel: { $like: q },
            vehicleBrand: { $like: q },
            vehicleColor: { $like: q },
          },
        },
      });

    this.tuvs = res.data.map((d: TuvFormData) => {
      const newData = d;
      newData.firstRegistry = new Date(d.firstRegistry as unknown as string).toDateString();
      return newData;
    });
  }
}
</script>
