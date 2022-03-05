<template>
  <div v-if="user" class="dark:text-neutral-300">
    <div class="text-4xl text-gray-800 mt-8 mb-1 font-bold dark:text-neutral-300">
      Manage driving license requests
    </div>

    <div class="flex flex-row items-center mt-3 mb-1">
      <button
        class="btn bg-blue-400 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-800 text-xs mr-2"
        @click="$toast.show('Refreshed!'); populate()">
        Refresh
      </button>
      <div class="text-gray-400">
        Last Updated: {{ lastUpdated }}
        (Next in {{ this.refreshInterval / 1000 - this.sinceRefresh / 1000 }}s)
      </div>
    </div>

    <div class="mt-5 overflow-x-auto">
      <table class="table-auto border-collapse border border-green-800 text-sm">
        <thead>
        <tr>
          <th>Actions</th>
          <th
            v-for="(header, i) in Object.keys(headerRelationMap).filter((_, i) => i !== 0)"
            :key="i">
            <span v-if="header !== null">{{ header }}</span>
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(response, i) in requests" :key="i">
          <td>
            <button class="btn bg-green-600 hover:bg-green-900 text-xs"
                    @click="approve(response);">
              Approve
            </button>

            <button class="btn bg-red-500 hover:bg-red-900 text-xs mr-0"
                    @click="deleteRequest(response.id || -1);">
              Delete
            </button>
          </td>
          <td
            v-for="(header, i) in Object.keys(headerRelationMap).filter((_, i) => i !== 0)"
            :key="i">
            <img v-if="isDataUrl(response[headerRelationMap[header]])"
                 :src="response[headerRelationMap[header]]" alt="signature image"
                 class="w-52 dark:bg-neutral-700 rounded">
            <span v-else>
            {{ response[headerRelationMap[header]] || '-' }}
            </span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import User from '@/helpers/interfaces/user';
import DriversLicense, { DriversLicenseRequest } from '@/helpers/interfaces/driversLicense';
import feathersClient, { AuthObject } from '@/helpers/feathers-client';

@Component
export default class DriversLicenses extends Vue {
  private user: User | null = null;
  private requests: DriversLicenseRequest[] = [];
  private lastUpdated = 'Loading...';
  private headerRelationMap = {
    Created: 'createdAt',
    Owner: 'discordName',
    Class: 'class',
    'Has time': 'hasTime',
    Signature: 'signature',
    Notes: 'additionalNotes',
  };
  private refreshInterval = 30_000;
  private sinceRefresh = 0;

  private async mounted (): Promise<void> {
    this.user = (await feathersClient.get('authentication') as AuthObject).user;

    await this.populate();

    setInterval(async () => {
      await this.populate();
    }, this.refreshInterval);

    setInterval(() => {
      this.sinceRefresh += 1_000;
    }, 1_000);
  }

  private async populate (): Promise<void> {
    const res = await feathersClient.service('drivers-license-request')
      .find();
    if (!res) return;

    this.requests = res;
    const d = new Date();
    this.lastUpdated = d.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: !!new Intl.DateTimeFormat([], { hour: 'numeric' })
        .format(0)
        .match(/\s/),
    });

    console.log('refreshsed');
    this.sinceRefresh = 0;
  }

  private isDataUrl (url: string): boolean {
    return url.startsWith('data:image');
  }

  private async approve (data: DriversLicenseRequest): Promise<void> {
    if (!this.user) return;
    if (!data.id) return;

    const existing: DriversLicense[] = await feathersClient.service('drivers-license')
      .find({
        query: {
          owner: data.owner,
        },
      });

    if (existing.length === 0) {
      await feathersClient.service('drivers-license')
        .create({
          discordName: data.discordName,
          owner: data.owner,
          classes: [data.class],
          instructor: `${this.user.username}#${this.user.discriminator}`,
          issued: new Date().toDateString(),
          signature: data.signature,
        } as DriversLicense);
    } else {
      const { classes } = existing[0];
      classes.push(data.class);
      console.log(classes);

      await feathersClient.service('drivers-license')
        .patch(existing[0].id, {
          classes,
          signature: data.signature,
        });
    }

    await this.deleteRequest(data.id);
  }

  private async deleteRequest (id: number): Promise<void> {
    await feathersClient.service('drivers-license-request')
      .remove(id);
    await this.populate();
  }
}
</script>
