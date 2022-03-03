<template>
  <div>
    <nav
      class="bg-slate-800 dark:bg-black h-16 shadow-xl font-medium text-gray-200 text-lg px-4 flex flex-row items-center nav justify-between">
      <div class="flex flex-row items-center">
        <button class="text-gray-100 ml-2 mr-6 nav-button-base bg-gray-600 hover:bg-gray-900"
                @click="$route.name !== 'home' ? $router.push({name: 'home'}) : null">
          RedwoodRP
        </button>

        <div v-for="(item, i) in cleanedItems" :key="i"
             class="hover:font-bold transition-all cursor-pointer" v-show="showItems">
          <span v-if="hasPermissions(item.requiredPermissions)">
            <button
              @click="$route.path !== $router.match(item.to).path ? $router.push(item.to) : null"
              class="nav-button-base text-gray-200"
              :class="$route.path === $router.match(item.to).path ? 'bg-transparent' : 'bg-slate-700 hover:bg-slate-900'"
            >
              {{ item.name }}
            </button>
            <!--          <span class="text-gray-400 font-bold mx-6 select-none"
                            v-show="i !== cleanedItems.length - 1">|</span>
                      </span>-->
            </span>
        </div>
      </div>

      <div class="flex flex-row">
        <button class="bg-slate-700 btn hover:bg-slate-900 shadow-lg"
                :class="{'-mr-1.5': showItems}"
                title="logout" @click="user === null ? login() : logout()">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="white">
            <path
              d="M17 8l-1.41 1.41L17.17 11H9v2h8.17l-1.58 1.58L17 16l4-4-4-4zM5 5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h7v-2H5V5z"
              v-if="user !== null" />
            <path
              d="M10 17v-3H3v-4h7V7l5 5-5 5m0-15h9a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2v-2h2v2h9V4h-9v2H8V4a2 2 0 0 1 2-2z"
              v-else />
          </svg>
        </button>
        <button class="rounded bg-slate-700 w-10 h-10 flex justify-center items-center cursor-pointer"
             :class="{ 'hidden': showItems }"
             @click="menuOpen = !menuOpen">
          <svg style="width:24px;height:24px" viewBox="0 0 24 24"
               v-if="!menuOpen">
            <path fill="currentColor" d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
          </svg>

          <svg style="width:24px;height:24px" viewBox="0 0 24 24" v-else>
            <path fill="currentColor"
                  d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
          </svg>
        </button>
      </div>
    </nav>

    <Modal v-model="menuOpen" :close-esc="true" :close-outside="true" max-width="400px"
           width="400px" @click="menuOpen = false">
      <div class="flex flex-col space-y-0.5 w-full">
        <button class="btn hover:bg-gray-800 w-full text-white bg-yellow-500"
                v-for="(item, i) in items"
                :key="i" @click="menuOpen = false; navigateTo(item.to)"
                v-show="hasPermissions(item.requiredPermissions)"
        >
          <span>
            {{ item.name }}
          </span>
        </button>
        <button class="wb-1 btn bg-red-500 hover:bg-red-800 w-full"
                @click="user === null ? login() : logout()">
          {{ user === null ? 'Login' : 'Logout' }}
        </button>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
  Watch,
} from 'vue-property-decorator';
import { RawLocation } from 'vue-router';
import User, { UserPermissions } from '@/helpers/interfaces/user';
import { debounce } from '@/helpers/generic';
import Modal from '@/components/Modal.vue';
import feathersClient, { AuthObject, FeathersError } from '@/helpers/feathers-client';

export interface NavbarItem {
  name: string;
  to: RawLocation;
  requiredPermissions: UserPermissions[];

  /**
   * Default is true
   */
  requiresAuth?: boolean;
}

@Component({
  components: { Modal },
})
export default class Navbar extends Vue {
  @Prop({
    required: true,
    type: Array,
  }) private readonly items!: NavbarItem[];
  @Prop({
    default: 1100,
    type: Number,
  }) private readonly minSize!: number;
  private showItems = false;
  private menuOpen = false;
  private user: User | null = null;
  private loggedIn = true;
  private cleanedItems: NavbarItem[] = [];

  async mounted (): Promise<void> {
    try {
      await feathersClient.authenticate();
    } catch (e) {
      if ((e as FeathersError).code === 401) {
        this.loggedIn = false;
      }
    }

    const interval = setInterval(async () => {
      if (feathersClient) {
        const authObject: AuthObject = await feathersClient.get('authentication');
        if (authObject) {
          console.log(authObject.user);
          this.user = authObject.user;
          clearInterval(interval);
        }
      }
    }, 100);

    if (!this.loggedIn) clearInterval(interval);

    this.showItems = window.innerWidth > this.minSize;
    window.addEventListener('resize', debounce(() => {
      this.showItems = window.innerWidth > this.minSize;
    }, 300));

    this.cleanItems();
  }

  @Watch('user')
  private userUpdate (): void {
    this.cleanItems();
  }

  @Watch('item')
  private cleanItems (): void {
    this.cleanedItems = this.items.filter((it) => this.hasPermissions(it.requiredPermissions));
  }

  private login (): void {
    this.$router.push({
      name: 'login',
      query: {
        redirect: encodeURIComponent(window.location.pathname),
      },
    });
  }

  private async logout (): Promise<void> {
    await feathersClient.logout();
    window.location.reload();
  }

  private hasPermissions (permissions: UserPermissions[]): boolean {
    if (permissions.length === 0) return true;
    if (!this.user) return false;
    const userPermissions = this.user.permissions;

    let hasPermission = true;
    permissions.forEach((p) => {
      if (this.user && !userPermissions.includes(p)) {
        hasPermission = false;
      }
    });

    console.log('hasPerm', hasPermission);
    return hasPermission;
  }

  private navigateTo (rawLocation: RawLocation): void {
    const c = this.$route;
    const d = this.$router.match(rawLocation);
    if (d.name === c.name || d.path === c.path || d.fullPath === c.fullPath) return;
    this.$router.push(rawLocation);
  }
}
</script>

<style>
.nav-button-base {
  @apply rounded transition-all hover:scale-110 hover:rotate-1 p-1 px-2 mr-5 ease-in-out shadow hover:shadow-none;
}
</style>
