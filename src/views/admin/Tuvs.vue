<template>
  <div v-if="user" class="dark:text-neutral-300">
    <div class="text-4xl text-gray-800 dark:text-neutral-300 mt-8 mb-1 font-bold">
      Approve/Decline incoming TÜV
    </div>

    <div class="flex flex-row items-center mt-3 mb-1">
      <button class="btn bg-blue-400 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-800 text-xs mr-2"
              @click="$toast.show('Refreshed!'); populate()">
        Refresh
      </button>
      <div class="text-gray-400">
        Last Updated: {{ lastUpdated }} (Next in
        {{ this.refreshInterval / 1000 - this.sinceRefresh / 1000 }}s)
      </div>
    </div>

    <div class="border border-gray-400 dark:border-none dark:bg-neutral-800 rounded-lg my-2 mt-5 p-2 flex flex-row justify-around">
      <div>
        <input type="checkbox" v-model="filters.showChecked" @change="populate"
               id="filter-show-approved" class="w-8">
        <label for="filter-show-approved">Show done/checked</label>
      </div>

      <div>
        <input type="checkbox" v-model="filters.showSearchBar" id="filter-show-search" class="w-8"
               @change="search = ''">
        <label for="filter-show-search">Show search bar</label>
      </div>
    </div>

    <input type="search"
           class="transition-all duration-300 mt-6 rounded-full px-6 py-3 border hover:shadow-lg focus:shadow-lg border-gray-300 bg-white text-lg mb-4 w-full"
           placeholder="Search..." v-model="search" @blur="populate" @keydown.enter="populate"
           v-show="filters.showSearchBar">

    <div class="mt-5 overflow-x-auto">
      <table class="table-auto border-collapse text-sm w-full">
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
        <tr v-for="(response, i) in responses" :key="i">
          <td class="whitespace-nowrap">
            <button class="btn bg-green-600 hover:bg-green-900 text-xs ml-0.5"
                    @click="approve(response.id, response.owner);">
              Approve
            </button>
            <button class="btn bg-red-500 hover:bg-red-800 text-xs mr-0.5"
                    @click="declineDialog.id = response.id; declineDialog.owner = response.owner; declineDialog.show = true">
              Decline
            </button>
          </td>
          <td
            v-for="(header, i) in Object.keys(headerRelationMap).filter((_, i) => i !== 0)"
            :key="i">
            {{
              response[headerRelationMap[header]] === null || response[headerRelationMap[header]] === undefined ? '-' : tryFormatBool(headerRelationMap[header], response[headerRelationMap[header]])
            }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <Modal v-model="declineDialog.show">
      <div class="modal-title">Decline reasoning</div>
      <div class="modal-description">
        Please state the reason for declining the request here:
      </div>
      <textarea
        class="textarea"
        placeholder="Description" v-model="declineReason" />
      <div class="flex flex-row space-x-2">
        <button class="btn bg-gray-400 dark:bg-neutral-800 hover:bg-gray-700 dark:hover:bg-neutral-900"
                @click="declineDialog.show = false;">
          Cancel
        </button>
        <button
          class="btn bg-green-600 dark:bg-green-700 w-full flex flex-row justify-center items-center hover:bg-green-900"
          @click="decline(declineDialog.id, declineDialog.owner); declineDialog.show = false">
          Send
        </button>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Modal from '@/components/Modal.vue';
import feathersClient, { AuthObject } from '@/helpers/feathers-client';
import { TuvFormData } from '@/helpers/generic';
import User from '@/helpers/interfaces/user';

@Component({
  components: {
    Modal,
  },
})
export default class Overview extends Vue {
  private user: User | null = null;
  private headerRelationMap = {
    owner: 'owner',
    Name: 'discordName',
    'License Pl.': 'licensePlate',
    '1st registry': 'firstRegistry',
    Brand: 'vehicleBrand',
    Model: 'vehicleModel',
    Engine: 'engineType',
    hp: 'engineHorsepower',
    ccm: 'engineCCM',
    Fuel: 'fuelType',
    Transmission: 'transmission',
    Body: 'bodyType',
    Color: 'vehicleColor',
    Weight: 'vehicleWeight',
    Seats: 'vehicleSeatsAmount',
    Year: 'vehicleYear',
    'Additional Infos': 'additionalInfos',
    Checked: 'checked',
    Approved: 'approved',
    Inspector: 'inspector',
  };
  private responses: TuvFormData[] = [];
  private declineDialog = {
    show: false,
    id: -1,
    owner: '',
  };
  private declineReason = '';
  private lastUpdated = '';
  private filters = {
    showChecked: false,
    showSearchBar: false,
  };
  private search = '';
  private refreshInterval = 30_000;
  private sinceRefresh = 0;

  async mounted (): Promise<void> {
    this.user = (await feathersClient.get('authentication') as AuthObject).user;
    await this.populate();

    setInterval(async () => {
      await this.populate();
    }, this.refreshInterval);

    setInterval(() => {
      this.sinceRefresh += 1_000;
    }, 1_000);
  }

  async populate (): Promise<void> {
    const q = { $like: `%${this.search}%` };
    const params = {
      query: {
        $limit: 50,
        checked: { $or: [this.filters.showChecked, null] },
        $or: {
          vehicleBrand: q,
          vehicleModel: q,
          vehicleColor: q,
          vehicleYear: q,
          owner: q,
          licensePlate: q,
          tid: q,
        },
      },
    };

    const service = feathersClient.service('tuv-forms');
    const res = await service.find(params);

    this.responses = [];
    (res as TuvFormData[]).forEach((form: TuvFormData) => {
      const newForm = form;
      if (newForm.firstRegistry !== null) {
        newForm.firstRegistry = (new Date(form.firstRegistry as string)).toDateString();
      }
      this.responses.push(newForm);
    });

    const d = new Date();
    this.lastUpdated = d.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: !!new Intl.DateTimeFormat([], { hour: 'numeric' })
        .format(0)
        .match(/\s/),
    });
    this.sinceRefresh = 0;
  }

  private tryFormatBool (field: string, val: string): string {
    switch (field) {
      case 'approved':
      case 'checked':
        return Boolean(val)
          .toString();

      default:
        return val;
    }
  }

  private async approve (id: number, owner: string): Promise<void> {
    console.log('approve', this.user);
    if (!this.user) return;

    await feathersClient.service('approve-tuv')
      .create({
        inspector: this.user.discordId,
        userId: owner,
        dbId: id,
      });

    await this.populate();
  }

  private async decline (id: number, owner: string): Promise<void> {
    if (!this.user) return;
    if (this.declineReason.length === 0) this.declineReason = 'No reason specified.';

    await feathersClient.service('approve-tuv')
      .remove(id, {
        query: {
          inspector: this.user.discordId,
          userId: owner,
          declineReason: this.declineReason,
        },
      });

    await this.populate();
  }
}
</script>
