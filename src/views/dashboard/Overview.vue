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
      <table class="table-auto border-collapse border border-green-800">
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
            <button class="btn bg-green-600 hover:bg-green-900" @click="approve()">Approve</button>
            <button class="btn bg-red-500 hover:bg-red-800" @click="declineDialog = true">Decline
            </button>
            <button class="btn bg-blue-500 hover:bg-blue-800">Inspection queue</button>
          </td>
          <td
            v-for="(header, i) in Object.keys(headerRelationMap).filter((_, i) => i !== 0)"
            :key="i">
            {{ response[headerRelationMap[header]] }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <Modal v-model="declineDialog">
      <div class="font-bold text-gray-800 text-xl">Decline reasoning</div>
      <div class="font-medium text-gray-600">Please state the reason for declining the request
        here:
      </div>
      <textarea
        class="border-2 border-black rounded w-full resize-y mt-1 mb-3 p-0.5 px-1 max-h-36 min-h-14 h-14"
        placeholder="Description" v-model="declineReason" />
      <div class="flex flex-row space-x-2">
        <button class="btn bg-gray-400 hover:bg-gray-700"
                @click="declineDialog = false; modalLoading = false;">Cancel
        </button>
        <button class="btn bg-green-600 w-full flex flex-row justify-center items-center"
                :class="{'hover:bg-green-900' : !modalLoading}"
                :disabled="modalLoading" @click="modalLoading = true" ref="modalSendBtn">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
               fill="none" viewBox="0 0 24 24" v-show="modalLoading">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                    stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span v-show="!modalLoading">Send</span>
        </button>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Modal from '@/components/Modal.vue';
import feathersClient, { User } from '@/helpers/feathers-client';
import { TuvFormData } from '@/helpers/generic';

@Component({
  components: {
    Modal,
  },
})
export default class Overview extends Vue {
  private user: User | null = null;
  private headers = [
    'Name',
    'Timestamp',
    'License Plate',
    'First Registry',
    'Brand',
    'Model',
    'Engine Type',
    'hp',
    'ccm',
    'Fuel Type',
    'Transmission',
    'Body Type',
    'Color',
    'Weight',
    'Seats',
    'Year',
    'Additions',
  ];
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
  };
  private responses: TuvFormData[] = [];
  private declineDialog = false;
  private modalLoading = false;
  private declineReason = '';

  async mounted (): void {
    const service = feathersClient.service('tuv-forms');
    const res = await service.find({
      query: {
        $limit: 50,
      },
    });

    (res.data as TuvFormData[]).forEach((form: TuvFormData) => {
      const newForm = form;
      if (newForm.firstRegistry !== null) {
        newForm.firstRegistry = (new Date(form.firstRegistry)).toDateString();
      }
      this.responses.push(newForm);
    });

    console.log(this.responses);
  }

  private approve (id: string): void {
    // Send server to approve TÜV
  }
}
</script>

<style scoped>
table > thead > tr > th,
table > tbody > tr > td {
  @apply border border-gray-400 rounded m-2 p-1.5;
}
</style>
