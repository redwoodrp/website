<template>
  <div class="mt-8 flex flex-col">
    <div class="text-4xl text-gray-800 dark:text-neutral-300 font-bold">Revoke drivers licenses</div>
    <div class="text-gray-600 dark:text-neutral-500">Enter username below, click revoke, select class, accept
      confirmation.
    </div>

    <input type="search"
           class="round-text-input"
           placeholder="Enter username..." v-model="search" @change="searchQuery()">

    <div class="mt-5 overflow-x-auto text-gray-300">
      <table class="table-auto border-collapse border border-green-800 text-sm">
        <thead>
        <tr>
          <th>Actions</th>
          <th
            v-for="(header, i) in Object.keys(headerRelationMap)"
            :key="i">
            <span v-if="header !== null">{{ header }}</span>
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(response, i) in results" :key="i">
          <td>
            <button class="btn bg-green-600 hover:bg-green-900 text-xs"
                    @click="revokeDialog.data = response; revokeDialog.show = true">
              Revoke
            </button>
          </td>
          <td
            v-for="(header, i) in Object.keys(headerRelationMap)"
            :key="i">
            {{ formatResponse(response[headerRelationMap[header]]) }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <Modal close-outside close-esc v-model="revokeDialog.show" v-if="revokeDialog.data">
      <div class="modal-title">Revoke drivers license of {{ revokeDialog.data.discordName }}</div>
      <div class="modal-description">Select the classes you want to revoke below.</div>

      <div class="mt-4">
        <div v-for="(vehicleClass, i) in revokeDialog.data.classes.split(',').sort()" :key="i">
          <input type="checkbox" class="w-8" :id="`dialogCheckbox-${i}`">
          <label :for="`dialogCheckbox-${i}`">{{ vehicleClass }}</label>
        </div>

        <div class="flex flex-row mt-4">
          <button class="btn bg-gray-200 hover:bg-gray-600 text-gray-900 hover:text-gray-200 w-1/3">
            Close
          </button>
          <button class="btn bg-green-500 hover:bg-green-800 w-full"
                  @click="revokeLicense(revokeDialog.data)">Revoke
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import feathersClient from '@/helpers/feathers-client';
import DriversLicense from '@/helpers/interfaces/driversLicense';
import Modal from '@/components/Modal.vue';

interface RevokeDialog {
  data: DriversLicense | null;
  show: boolean;
}

@Component({
  components: {
    Modal,
  },
})
export default class RevokeDriversLicenses extends Vue {
  private headerRelationMap = {
    Created: 'createdAt',
    Instructor: 'instructor',
    Owner: 'discordName',
    Classes: 'classes',
  };
  private search = '';
  private results: DriversLicense[] = [];
  private revokeDialog: RevokeDialog = {
    data: null,
    show: false,
  };
  private vehicleClasses = [
    'A',
    'A1',
    'B',
    'C',
    'C1',
    'D',
  ];

  private async searchQuery (): Promise<void> {
    this.results = await feathersClient.service('drivers-license')
      .find({
        query: {
          $or: {
            discordName: {
              $like: `%${this.search}%`,
            },

            owner: {
              $like: `%${this.search}%`,
            },
          },
        },
      });
  }

  private formatResponse (res: string): string {
    if (!res) return '-';

    // Date
    if (res.split(' ').length === 3 && typeof res.split(' ')[0].split('-') === 'object') {
      return res.split(' ')[0].split('-')
        .join('/');
    }

    // Array
    const arr = res.split(',');
    if (arr.length !== 0) {
      return arr.join(', ');
    }

    return res;
  }

  private async revokeLicense (data: DriversLicense): Promise<void> {
    try {
      console.log(data.classes);
    } catch (e) {
      console.log(e);
    }
  }
}
</script>

<style scoped>

</style>
