<template>
  <div>
    <div class="text-xl text-gray-800 font-medium">
      <span v-if="user && user.username">
        Welcome, {{ user.username }}!
      </span>
      <span v-else>
        Welcome!
      </span>
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
            <button class="btn bg-green-600 hover:bg-green-900"
                    @click="approve(response.id, response.owner)">
              Approve
            </button>
            <button class="btn bg-red-500 hover:bg-red-800"
                    @click="declineDialog.id = response.id; declineDialog.owner = response.owner; declineDialog.show = true">
              Decline
            </button>
            <button class="btn bg-blue-500 hover:bg-blue-800">Inspection queue</button>
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
          @click="decline(declineDialog.id, declineDialog.owner);">
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

  async mounted (): Promise<void> {
    this.user = (await feathersClient.get('authentication') as AuthObject).user;

    const service = feathersClient.service('tuv-forms');
    const res = await service.find({
      query: {
        $limit: 50,
      },
    });

    (res.data as TuvFormData[]).forEach((form: TuvFormData) => {
      const newForm = form;
      if (newForm.firstRegistry !== null) {
        newForm.firstRegistry = (new Date(form.firstRegistry as string)).toDateString();
      }
      this.responses.push(newForm);
    });

    console.log(this.responses);
  }

  private async approve (id: number, owner: string): Promise<void> {
    console.log('approve', this.user);
    if (!this.user) return;
    await feathersClient.service('tuv-forms')
      .patch(id, {
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
        approved: true,
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
