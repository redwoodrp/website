<template>
  <div class="mt-4">
    <div v-if="user">
      <div class="text-gray-800 text-4xl font-bold">Hello, {{ user.username }}</div>
      <div class="text-gray-400 font-medium">What do you wanna do today?</div>

      <div class="flex flex-col md:flex-row w-full justify-between mt-8">
        <div class="flex flex-col space-y-6 rounded-xl shadow-lg p-5 border border-gray-300">
          <div class="flex flex-col">
            <div class="value" v-if="wallet">
              ${{ wallet.total ? formatBalance(wallet.total || 0) : '-' }}
            </div>
            <div class="value" v-else>-</div>

            <div class="title">Total</div>
          </div>

          <div class="flex flex-col w-44">
            <div class="value" v-if="wallet">${{
                wallet.bank ? formatBalance(wallet.bank || 0) : '-'
              }}
            </div>
            <div class="value" v-else>-</div>

            <div class="title">Bank</div>
          </div>

          <div class="flex flex-col">
            <div class="value" v-if="wallet">${{
                wallet.cash ? formatBalance(wallet.cash || 0) : '-'
              }}
            </div>
            <div class="value" v-else>-</div>

            <div class="title">Cash</div>
          </div>

          <div class="flex flex-col">
            <div class="value">{{ vehicles || 0 }}</div>
            <div class="title">Vehicles</div>
          </div>

          <div class="flex flex-col">
            <div class="value">{{ playerCount || 0 }}</div>
            <div class="title">Players Online</div>
          </div>
        </div>

        <div
          class="flex flex-col md:ml-4 space-y-4 md:space-y-0 mt-4 md:mt-0 md:justify-between w-full">
          <button class="outline-btn" @click="navigateTo(nav.to, nav.workInProgress || false)"
                  v-for="(nav, i) in quickNav"
                  :key="i">
            {{ nav.name }}
          </button>
        </div>
      </div>

      <div class="mt-8 border border-gray-400 rounded-lg" v-if="driversLicense && user">
        <img :src="`${config.backend}/images/${user.discordId}/driverslicense.jpg`"  alt="Drivers license picture" />
      </div>

      <!--   AD    -->
      <!-- <AdBanner /> -->

    </div>
    <div v-else>
      Loading...
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RawLocation } from 'vue-router';
import feathersClient, { AuthObject } from '@/helpers/feathers-client';
import User from '@/helpers/interfaces/user';
import { NavbarItem } from '@/components/Navbar.vue';
import AdBanner from '@/components/AdBanner.vue';
import { BeamMPServer, Wallet } from '@/helpers/interfaces/apis';
import DriversLicenses from '@/views/admin/DriversLicenses.vue';
import config from '../../../config';

interface QuickNavItem extends Omit<NavbarItem, 'requiredPermissions' | 'requiresAuth'> {
  workInProgress?: boolean;
}

@Component({
  components: { AdBanner },
})
export default class Overview extends Vue {
  private wallet: Wallet | null = null;
  private vehicles: number | null = null;
  private playerCount: number | null = null;
  private user: User | null = null;
  private quickNav: QuickNavItem[] = [
    {
      name: 'MY TÜVS',
      to: '/me/tuvs',
    },
    {
      name: 'TÜV APPLICATION',
      to: '/me/forms/tuv',
    },
    {
      name: 'DRIVERS LICENSE',
      to: '/me/forms/driverslicense',
    },
    {
      name: 'CHECK TÜV',
      to: '/check/tuv',
    },
    {
      name: 'MANAGE WALLET',
      to: '/me/wallet',
      workInProgress: true,
    },
  ];
  private driversLicense: DriversLicenses | null = null;
  private config = config;

  async mounted (): Promise<void> {
    // Get vehicle count
    this.user = (await feathersClient.get('authentication') as AuthObject).user;
    console.log(this.user);

    this.vehicles = await this.getVehicleCount();
    const servers = await this.getOurMPServers();
    if (!servers) return;

    this.playerCount = 0;
    servers.forEach((s) => {
      if (!this.playerCount) return;
      this.playerCount += parseInt(s.players, 10);
    });
    this.wallet = await this.getWallet();

    // Drivers license
    const license: DriversLicenses[] = await feathersClient.service('drivers-license')
      .find({
        query: {
          owner: this.user.discordId,
        },
      });

    if (license.length !== 0) {
      // eslint-disable-next-line prefer-destructuring
      this.driversLicense = license[0];
    }
  }

  private async getVehicleCount (): Promise<number> {
    if (!this.user) return 0;

    const res = await feathersClient.service('tuv-forms')
      .find({
        query: {
          $count: true,
        },
      });

    return res.count;
  }

  private async getOurMPServers (): Promise<BeamMPServer[] | null> {
    const res = await fetch('https://backend.beammp.com/servers-info');
    if (!res.ok) return null;

    return (await res.json()).filter((s: BeamMPServer) => s.sname.includes('[ ^l^5Redwood ^3Economy ^r]'));
  }

  private async getWallet (): Promise<Wallet | null> {
    if (!this.user) return null;

    const res = await feathersClient.service('unbelieva-boat')
      .get(0, {
        query: {
          guildId: '845209391905112075',
        },
      }) as Wallet;

    return {
      bank: res.bank,
      cash: res.cash,
      total: res.total,
    } as Wallet;
  }

  private formatBalance (amount: number): string {
    return new Intl.NumberFormat('en-GB', {
      style: 'decimal',
      currency: 'USD',
      currencyDisplay: 'code',
      minimumFractionDigits: 0,
    }).format(amount);
  }

  private navigateTo (rawLocation: RawLocation, workInProgress: boolean): void {
    if (workInProgress) {
      this.$toast.show('Work in progress. Please try again later');
      return;
    }

    const c = this.$route;
    const d = this.$router.match(rawLocation);

    if (d.name === c.name || d.path === c.path || d.fullPath === c.fullPath) return;
    this.$router.push(rawLocation);
  }
}
</script>

<style>
.value {
  @apply text-4xl font-bold;
}

.title {
  @apply text-gray-400 font-bold -mt-1;
}

.separator {
  @apply w-0.5 h-full bg-gray-200 my-5;
}

.outline-btn {
  @apply transition-all w-full h-18 border-gray-800 text-gray-800 border-4 rounded-lg font-bold text-4xl shadow-lg hover:bg-gray-100 hover:shadow-xl transform hover:scale-105;
}
</style>
