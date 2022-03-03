<template>
  <div class="h-full w-full">
    <div class="text-4xl font-bold mt-4 text-gray-800">My business</div>

    <div v-if="business && state === 1">
      {{ business.name }}

      <div class="flex flex-row mt-4 space-x-4">
        <button class="juicy-btn"
             :class="btnActive(Page.CREATE_AD)"
             @click="currentPage = { name: 'Create ad', description: 'Create a new ad', page: Page.CREATE_AD }">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="mr-3">
            <path
              d="M17 14h2v3h3v2h-3v3h-2v-3h-3v-2h3v-3m3-3V8H4v3h16m-7 2v1.68c-.63.95-1 2.09-1 3.32 0 1.09.29 2.12.8 3H4a2 2 0 0 1-2-2V3l1.67 1.67L5.33 3
              7 4.67 8.67 3l1.66 1.67L12 3l1.67 1.67L15.33 3 17 4.67 18.67 3l1.66 1.67L22 3v10.5c-1.07-.92-2.47-1.5-4-1.5-1.23 0-2.37.37-3.32 1H13m-2 6v-6H4v6h7z" />
          </svg>
          Create ad
        </button>

        <button class="juicy-btn"
             :class="btnActive(Page.VIEW_ADS)"
             @click="currentPage = { name: 'View my ads', description: 'View all the ads your business currently has online', page: Page.VIEW_ADS }">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" class="mr-3 mt-0.5"
               viewBox="0 0 24 24"
               width="20"
               height="20">
            <path fill="#000"
                  d="M21.55 10.7H2.46V7.12h19.09v3.58zm0 4.77H13.2V13.1h8.35v2.38zm0 4.78H13.2v-2.4h8.35v2.4zm-10.74
                    0H2.46v-7.16h8.35v7.16zm11.13-17.1-1.98-2-1.99 2-2-2-1.97 2-2-2-1.99 2-1.98-2-1.99
                    2-1.99-2-1.98 2-2-2v19.1a2.38 2.38 0 0 0 2.4 2.38h19.08a2.38 2.38 0 0 0 2.39-2.38V1.14l-2 2z" />
            <circle cx="19.75" cy="18.56" r="5.36" fill="#fff" />
            <path fill="#000"
                  d="M19.75 19.96a1.4 1.4 0 0 1-1.4-1.4 1.4 1.4 0 0 1 1.4-1.4 1.4 1.4 0 0 1 1.4 1.4 1.4 1.4 0 0
                    1-1.4 1.4zm2.97-1.01.03-.39a3.42 3.42 0 0 0-.03-.4l.84-.65a.2.2 0 0 0 .05-.26l-.8-1.38a.2.2 0 0
                    0-.24-.09l-1 .4a2.9 2.9 0 0 0-.67-.4l-.15-1.05a.2.2 0 0 0-.2-.17h-1.6a.2.2 0 0 0-.2.17l-.15
                    1.06c-.25.1-.47.24-.67.4l-1-.4a.2.2 0 0 0-.24.08l-.8 1.38a.2.2 0 0 0 .05.26l.84.65-.03.4.03.39-.84.66a.2.2
                    0 0 0-.05.26l.8 1.38a.2.2 0 0 0 .24.09l1-.4a2.79 2.79 0 0 0 .67.4l.15 1.05c.02.1.1.17.2.17h1.6a.2.2 0 0 0
                    .2-.17l.15-1.06a2.91 2.91 0 0 0 .67-.4l1 .4c.09.04.2 0 .24-.08l.8-1.38a.2.2 0 0 0-.05-.26l-.84-.66z" />
          </svg>
          View ads
        </button>

        <button class="juicy-btn"
             :class="btnActive(Page.MANAGE_BUSINESSES)"
             @click="currentPage = { name: 'Manage business', description: 'Change data about your business', page: Page.MANAGE_BUSINESSES }">
          <svg style="width:24px;height:24px" viewBox="0 0 24 24" class="mr-3">
            <path fill="currentColor" d="M18,15H16V17H18M18,11H16V13H18M20,19H12V17H14V15H12V13H14V11H12V9H20M10,7H8V5H10M10,
            11H8V9H10M10,15H8V13H10M10,19H8V17H10M6,7H4V5H6M6,11H4V9H6M6,15H4V13H6M6,19H4V17H6M12,7V3H2V21H22V7H12Z" />
          </svg>
          Manage business
        </button>
      </div>

      <div class="border border-gray-100 rounded-xl shadow p-4 mt-2">
        <div class="font-bold text-xl text-gray-800">{{ currentPage.name }}</div>
        <div class="font-medium-text-gray-500 text-sm mb-4">{{ currentPage.description }}</div>

        <div v-if="currentPage.page === Page.HOME">Nothing to see here...</div>
        <div v-else-if="currentPage.page === Page.CREATE_AD">
          When creating a new ad, click on all the fields with the blue background to edit them.
          Pressing "Edit mode enabled" will show you how the ad banner looks with editing disabled.
          <div class="border border-gray-200 rounded-lg my-2 p-3">
            <div class="font-semibold text-gray-800 text-lg">Settings</div>

            <div>
              <div>
                <input type="checkbox" id="ad-show-title" class="w-6" name="Show title"
                       v-model="newAd.showTitle">
                <label for="ad-show-title">Show title</label>
              </div>

              <div>
                <input type="checkbox" name="Show description" class="w-6" id="ad-show-description"
                       v-model="newAd.showDescription">
                <label for="ad-show-description">Show description</label>
              </div>

              <div>
                <input type="checkbox" name="Show description" class="w-6" id="ad-editmode-enabled"
                       v-model="editingAd">
                <label for="ad-editmode-enabled">Editmode enabled</label>
              </div>

              <div class="flex flex-col mt-5">
                Where should the ad bring the user on click?
                <div class="bg-gray-100 rounded-lg px-2 flex flex-row">
                  <div class="p-1">
                    https://rdwrp.com
                  </div>
                  <input type="text" name="To" id="to"
                         class="bg-gray-200 transition-all border-b-2 focus:border-blue-500 -ml-1 outline-none"
                         :placeholder="`/businesses/${business.abbreviation}`"
                         v-model="newAd.to">
                </div>
              </div>

              <div class="mt-5 flex flex-col">
                Where should the ad be displayed?
                <div class="border border-gray-300 p-1.5 mt-1 rounded-lg">
                  <div
                    v-for="(page, i) in Object.values(AdPosition).filter(p => typeof p === 'string')"
                    :key="i">
                    <input type="checkbox" name="page" class="w-6" v-model="adPositions[i]">
                    <label :for="`checkbox-position-${i}`">{{ page.replace('_', ' ') }}</label>
                  </div>
                </div>
              </div>

              <div class="mt-5">
                How long should the ad be displayed?
                <select name="Ad display time" v-model="adDisplayTime">
                  <option :value="-1">Select</option>
                  <option :value="adTimeMap[i]"
                          v-for="(time, i) in ['3 days', '4 days', '5 days', '6 days', '1 week', '2 weeks', '3 weeks', '1 month']"
                          :key="i">
                    {{ time }}
                  </option>
                </select>
              </div>

              <div class="mt-5 flex flex-col border border-gray-300 p-2 rounded-lg">
                Add payment account
                <div class="text-gray-600 text-sm mb-4">
                  Once you are done typing out the name, press
                  verify and a message will get sent to your payment account. To verify that you own
                  the payment account, you will have to react with a checkmark to the message our
                  bot sends you.
                </div>
                <div class="flex flex-col">
                  <div class="flex flex-row">
                    <input type="text" name="Enter payment account name"
                           class="bg-gray-200 rounded-l focus:border-blue-500 focus:bg-gray-300 border-2 outline-none transition-all px-2 w-full"
                           v-model="paymentAccount">

                    <button
                      class="btn bg-green-500 hover:bg-green-800 w-2/3 rounded-l-none ring-inset focus:ring-2 outline-none focus:ring-blue-500"
                      @click="verifyPaymentAccount">
                      Verify
                    </button>
                  </div>

                  <div class="text-sm text-gray-600 ml-0.5 flex flex-row h-5 space-x-1 mt-1"
                       v-if="paymentVerification">
                    <img :src="paymentVerification.verified ? '/check.png' : '/cross.png'"
                         :alt="paymentVerification.verified ? 'check' : 'cross'">

                    <div>
                      {{ paymentVerification.verified ? 'Account accepted' : 'Account declined' }}:
                      {{ paymentVerification.reason || 'No reason specified.' }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-5 border border-gray-300 rounded-lg p-1.5">
                Price: ${{ makeNumberReadable(getPrice()) }}
                <div class="text-gray-600 text-sm">The price gets subtracted from your payment
                  account when a moderator accepts your ad.
                </div>
              </div>
            </div>
          </div>
          <AdBanner v-model="newAd" :edit-mode="editingAd" :shadow="false" class="mt-3"
                    @imgChange="imgChange" />

          <div class="text-sm ml-1 text-gray-600">
            <span v-if="adImg">
              Perfect image size:
              {{ getPerfectImageSize() }}
            </span>
            <span v-else>Perfect image size: Upload an image to know</span>
          </div>

          <button class="btn bg-green-500 hover:bg-green-800 mt-4 w-full" @click="submitNewAd">
            Upload
          </button>
        </div>
        <div v-else-if="currentPage.page === Page.VIEW_ADS">Vasdasddasdsadassda</div>
        <div v-else>Manage business</div>
      </div>
    </div>

    <div v-else class="flex h-96 justify-center items-center">
      <div v-if="state === 0">Loading...</div>
      <div v-if="state === 2">You don't own a business!</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import feathersClient, { AuthObject } from '@/helpers/feathers-client';
import User from '@/helpers/interfaces/user';
import {
  AdPosition,
  Business,
  BusinessAd,
  VerifyPaymentAccount,
} from '@/helpers/interfaces/business';
import { Ad, BaseState } from '@/helpers/generic';
import AdBanner from '@/components/AdBanner.vue';

enum Page {
  HOME,
  CREATE_AD,
  VIEW_ADS,
  MANAGE_BUSINESSES,
}

interface CurrentPage {
  name: string;
  description: string;
  page: Page;
}

@Component({
  components: {
    AdBanner,
  },
})
export default class Overview extends Vue {
  private state: BaseState = BaseState.LOADING;
  private business: Business | null = null;
  private user: User | null = null;
  private currentPage: CurrentPage = {
    name: 'Home',
    description: 'Click on one of the links above',
    page: Page.CREATE_AD, // Page.HOME
  };
  private Page = Page;
  private editingAd = true;
  private newAd: Ad = {
    business: this.business?.bid || '',
    to: '',
    imageSource: '',
    title: 'My ad',
    description: 'Cool description',
    show: true,
    showTitle: true,
    showDescription: true,
  };
  private adImg: HTMLImageElement | null = null;
  private AdPosition = AdPosition;
  private adDisplayTime = -1;
  private adPositions = [false, false];
  private adTimeMap = [3, 4, 5, 6, 7, 14, 21, 30]; // ['3 days', '4 days', '5 days', '6 days', '1 week', '2 weeks', '3 weeks', '1 month']
  private paymentAccount = '';
  private paymentVerification: null | VerifyPaymentAccount = null;

  async mounted (): Promise<void> {
    this.user = (await feathersClient.get('authentication') as AuthObject).user;
    if (!this.user) return;

    const res = await feathersClient.service('business')
      .find({
        ownerId: this.user.discordId,
      }) as Business[];

    console.log(res);

    if (res.length !== 0) {
      // eslint-disable-next-line prefer-destructuring
      this.business = res[0];
      this.state = BaseState.DONE;
    } else {
      this.state = BaseState.ERROR;
    }
  }

  imgChange (img: HTMLImageElement): void {
    this.adImg = img;
  }

  private btnActive (page: Page): { [classes: string]: boolean } {
    return { 'bg-gray-200 border-gray-200': this.currentPage.page === page };
  }

  private getPerfectImageSize (): string {
    if (!this.adImg) return 'error';

    return `${this.adImg.height}x${this.adImg.width}`;
  }

  private async submitNewAd (): Promise<void> {
    if (!this.business) return;
    if (!this.user) return;

    await feathersClient.service('business-ads')
      .create({
        bid: this.business.bid,
        owner: `${this.user.username}#${this.user.discriminator}`,
        title: this.newAd.title,
        description: this.newAd.description,
        imageSource: this.newAd.imageSource,
        to: this.newAd.to,
        reviewed: false,
        positions: this.adPositions.map((p, i) => (p ? i : ''))
          .filter((p) => typeof p === 'string') as unknown as AdPosition,
      } as BusinessAd);

    this.$toast.show('Uploaded.');
  }

  private getPrice (): number {
    if (this.adDisplayTime === -1) return 0;

    const positionPrices = [800, 600]; // Dashboard = 0; Home = 1
    let positionPrice = 0;
    this.adPositions.forEach((p, i) => {
      if (p) positionPrice += positionPrices[i];
    });

    return positionPrice + 600 * this.adDisplayTime;
    // Days  0 - 3
    // Week  4 - 6
    // Month 7
  }

  private makeNumberReadable (num: number): string {
    return new Intl.NumberFormat('en-GB', {
      style: 'decimal',
      currency: 'USD',
      currencyDisplay: 'code',
      minimumFractionDigits: 0,
    }).format(num);
  }

  private async verifyPaymentAccount (): Promise<void> {
    if (!this.user) return;
    if (!this.business) return;

    this.paymentVerification = await feathersClient.service('verify-payment-account')
      .create({
        author: this.user,
        business: this.business,
        price: this.getPrice(),
        verified: false,
        username: this.paymentAccount,
      } as VerifyPaymentAccount);
  }
}
</script>

<style lang="scss" scoped>
.juicy-btn {
  @apply p-4 rounded-lg shadow border border-gray-100  transition-all active:shadow-inner hover:bg-gray-100 active:bg-gray-200 cursor-pointer flex flex-row;
}

select {
  @apply p-1 bg-gray-800 text-white shadow-none rounded-lg;

  > option {
    @apply bg-gray-800 text-white shadow-none;
  }
}
</style>
