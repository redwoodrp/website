<template>
  <div v-if="user">
    <div class="text-4xl text-gray-800 mt-8 mb-1 font-bold">
      Manage business requests
    </div>

    <div class="flex flex-row items-center mt-3 mb-1">
      <button class="btn bg-blue-400 hover:bg-blue-600 text-xs mr-2"
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
            {{ Array.isArray(response[headerRelationMap[header]]) ? response[headerRelationMap[header]].join(', ') : response[headerRelationMap[header]] || '-' }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { v4 as uuidv4 } from 'uuid';
import feathersClient from '@/helpers/feathers-client';
import { Business, BusinessRequest } from '@/helpers/interfaces/business';
import User from '@/helpers/interfaces/user';

@Component
export default class BusinessApplications extends Vue {
  private refreshInterval = 30_000;
  private sinceRefresh = 0;
  private lastUpdated = 'Loading...';
  private requests: BusinessRequest[] = [];
  private headerRelationMap = {
    Owner: 'owner',
    Members: 'members',
    Name: 'name',
    'Abbr.': 'abbreviation',
  };
  private user: User | null = null;

  private async mounted (): Promise<void> {
    this.user = await feathersClient.get('authentication');

    setInterval(async () => this.populate(), this.refreshInterval);
    await this.populate();
  }

  private async populate (): Promise<void> {
    this.requests = await feathersClient.service('business-request')
      .find();
    this.sinceRefresh = 0;
    this.lastUpdated = (new Date()).toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: !!new Intl.DateTimeFormat([], { hour: 'numeric' })
        .format(0)
        .match(/\s/),
    });
  }

  private async deleteRequest (id: number): Promise<void> {
    await feathersClient.service('business-request')
      .remove(id);
  }

  private async approve (response: BusinessRequest): Promise<void> {
    await feathersClient.service('business-request')
      .remove(response.id);
    await feathersClient.service('business')
      .create({
        bid: uuidv4(),
        name: response.name,
        abbreviation: response.abbreviation,
        owner: response.owner,
        members: response.members,
      } as Business);
  }
}
</script>
