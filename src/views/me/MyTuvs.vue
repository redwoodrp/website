<template>
  <div class="flex justify-center flex-col mt-8">
    <div class="text-3xl text-gray-800 dark:text-neutral-300 font-bold">My TÜVs</div>
    <input type="search"
           class="round-text-input"
           placeholder="Search..." v-model="search" @change="searchQuery">

    <DisplayTuv :data="tuvs" class="mb-16"></DisplayTuv>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import feathersClient from '@/helpers/feathers-client';
import { TuvFormData } from '@/helpers/generic';
import User from '@/helpers/interfaces/user';
import DisplayTuv from '@/components/DisplayTuv.vue';

@Component({
  components: {
    DisplayTuv,
  },
})
export default class Tuvs extends Vue {
  @Prop() private tid: string | undefined;
  private search = '';
  private tuvs: TuvFormData[] = [];
  private user: User | null = null;

  async mounted (): Promise<void> {
    this.user = await feathersClient.get('user');
    console.log(this.user);

    if (!this.tid) {
      await this.searchQuery();
      return;
    }

    if (!this.user) return;
    console.log(this.user);

    const res = await feathersClient.service('tuv-forms')
      .find({
        query: {
          owner: this.user.discordId,
          tid: this.tid,
          checked: true,
        },
      });

    this.tuvs = res as TuvFormData[];
  }

  private async searchQuery (): Promise<void> {
    if (!this.user) return;

    const q = `%${this.search}%`;
    const res = await feathersClient.service('tuv-forms')
      .find({
        query: {
          owner: this.user.discordId,
          checked: true,
          $or: {
            vehicleModel: { $like: q },
            vehicleBrand: { $like: q },
            vehicleColor: { $like: q },
          },
        },
      });

    console.log(res, this.user.discordId);

    this.tuvs = res.map((d: TuvFormData) => {
      const newData = d;
      newData.firstRegistry = new Date(d.firstRegistry as unknown as string).toDateString();
      return newData;
    });
  }
}
</script>
