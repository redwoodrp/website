<template>
  <div>
    <div
      class="bg-gray-800 h-16 shadow-xl font-medium text-gray-200 text-lg px-4 flex flex-row items-center nav justify-between">
      <div class="flex flex-row">
        <router-link class="text-gray-100 font-bold mr-6" :to="{ name: 'home' }">
          RedwoodRP
        </router-link>
        <div v-for="(item, i) in items" :key="i"
             class="hover:font-bold transition-all cursor-pointer" v-show="showItems">
          <router-link :to="item.to">{{ item.name }}</router-link>
          <span class="text-gray-400 font-bold mx-6 select-none"
                v-show="i !== items.length - 1">|</span>
        </div>
      </div>

      <div class="rounded bg-gray-700 w-10 h-10 flex justify-center items-center cursor-pointer"
           @click="menuOpen = !menuOpen">
        <svg style="width:24px;height:24px" viewBox="0 0 24 24"
             v-if="!menuOpen">
          <path fill="currentColor" d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
        </svg>

        <svg style="width:24px;height:24px" viewBox="0 0 24 24" v-else>
          <path fill="currentColor"
                d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
        </svg>
      </div>

    </div>

    <Modal v-model="menuOpen" :close-esc="true" :close-outside="true" max-width="400px" width="400px" @click="menuOpen = false">
      <div class="flex flex-col space-y-0.5 w-full">
      <button class="btn bg-indigo-500 hover:bg-indigo-800 w-full" v-for="(item, i) in items"
              :key="i" @click="menuOpen = false; navigateTo(item.to)">
        {{ item.name }}
      </button>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { RawLocation } from 'vue-router';
import { UserPermissions } from '@/helpers/interfaces/user';
import { debounce } from '@/helpers/generic';
import Modal from '@/components/Modal.vue';

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
    default: 750,
    type: Number,
  }) private readonly minSize!: number;
  private showItems = false;
  private menuOpen = false;

  mounted (): void {
    this.showItems = window.innerWidth > this.minSize;
    window.addEventListener('resize', debounce(() => {
      this.showItems = window.innerWidth > this.minSize;
    }, 300));
  }

  private navigateTo (rawLocation: RawLocation): void {
    const c = this.$route;
    const d = this.$router.match(rawLocation);
    if (d.name === c.name || d.path === c.path || d.fullPath === c.fullPath) return;
    this.$router.push(rawLocation);
  }
}
</script>
