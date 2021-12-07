<template>
  <div v-if="user">
    <div class="text-4xl text-gray-800 mt-8 mb-1 font-bold">
      Approve/Decline incoming TÜV
    </div>

    <div class="flex flex-row items-center mt-3 mb-1">
      <button class="btn bg-blue-400 hover:bg-blue-600 text-xs mr-2" @click="$toast.show('Refreshed!'); populate()">Refresh</button>
      <div class="text-gray-400">Last Updated: {{ lastUpdated }}</div>
    </div>

    <div class="mt-5">
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
        <tr v-for="(response, i) in responses" :key="i">
          <td>
            <button class="btn bg-green-600 hover:bg-green-900 text-xs ml-0.5"
                    @click="approve(response.id, response.owner); populate()">
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
              !response[headerRelationMap[header]] ? '-' : response[headerRelationMap[header]]
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
        class="border-2 border-black rounded w-full resize-y mt-1 mb-3 p-0.5 px-1 max-h-36 min-h-14 h-14"
        placeholder="Description" v-model="declineReason" />
      <div class="flex flex-row space-x-2">
        <button class="btn bg-gray-400 hover:bg-gray-700"
                @click="declineDialog.show = false;">
          Cancel
        </button>
        <button
          class="btn bg-green-600 w-full flex flex-row justify-center items-center hover:bg-green-900"
          @click="decline(declineDialog.id, declineDialog.owner); populate()">
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

  async mounted (): Promise<void> {
    this.user = (await feathersClient.get('authentication') as AuthObject).user;
    await this.populate();
  }

  async populate (): Promise<void> {
    const service = feathersClient.service('tuv-forms');
    const res = await service.find({
      query: {
        $limit: 50,
      },
    });

    this.responses = [];
    (res.data as TuvFormData[]).forEach((form: TuvFormData) => {
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
  }

  private async approve (id: number, owner: string): Promise<void> {
    console.log('approve', this.user);
    if (!this.user) return;
    await feathersClient.service('tuv-forms')
      .patch(id, {
        checked: true,
        approved: true,
        inspector: `${this.user.username}#${this.user.discriminator}`,
      });

    await feathersClient.service('approve-tuv')
      .create({
        userId: owner,
        dbId: id,
      });
  }

  private async decline (id: number, owner: string): Promise<void> {
    if (!this.user) return;
    if (!this.declineReason) this.declineReason = 'No reason specified.';

    await feathersClient.service('tuv-forms')
      .patch(id, {
        checked: true,
        approved: false,
        inspector: `${this.user.username}#${this.user.discriminator}`,
        declineReason: this.declineReason,
      });

    await feathersClient.service('approve-tuv')
      .remove(id, {
        query: {
          userId: owner,
        },
      });
  }
}
</script>

<style scoped>
table > thead > tr > th,
table > tbody > tr > td {
  @apply border border-gray-400 rounded m-2 p-1.5;
}
</style>
