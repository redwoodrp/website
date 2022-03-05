<template>
  <div class="mt-8 flex flex-col">
    <div class="text-4xl text-gray-800 dark:text-neutral-300 font-bold">License Plate Check</div>
    <div class="text-gray-600 dark:text-neutral-500">Check license plates for valid tuvs.</div>

    <input type="search"
           class="round-text-input"
           placeholder="Enter license plate here..." v-model="search" @change="searchQuery()">

    <DisplayTuv :data="tuvs"></DisplayTuv>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import feathersClient from '@/helpers/feathers-client';
import { TuvFormData } from '@/helpers/generic';
import DisplayTuv from '@/components/DisplayTuv.vue';

@Component({
  components: {
    DisplayTuv,
  },
})
export default class CheckTuvs extends Vue {
  private search = '';
  private tuvs: TuvFormData[] = [];

  private async searchQuery (): Promise<void> {
    const q = `%${this.search}%`;
    const res = await feathersClient.service('tuv-forms')
      .find({
        query: {
          approved: true,
          checked: true,
          $or: {
            licensePlate: { $like: q },
            discordName: { $like: q },
          },
        },
      });

    console.log(res);

    this.tuvs = res.map((d: TuvFormData) => {
      const newData = d;
      newData.firstRegistry = new Date(d.firstRegistry as unknown as string).toDateString();
      return newData;
    });
  }
}
</script>
