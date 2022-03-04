<template>
  <div class="background h-full flex flex-col bg-white dark:bg-neutral-900 overflow-auto">
    <div class="flex flex-col h-full justify-center items-center flex-grow">
      <div class="text-slate-900 dark:text-gray-100 font-bold text-3xl">
        Welcome home
      </div>
      <div class="text-gray-400 font-medium">
        RedwoodRP is a roleplay BeamMP server network.
      </div>
    </div>

    <div>
      <div
        class="flex flex-col items-center text-white opacity-30 text-center text-sm md:text-base">
        This website is still in the works. Please stay tuned for updates!
      </div>

      <img class="flex flex-col w-full" src="@/assets/wave.svg" alt="wave">
    </div>

    <div class="bg-gradient-to-b from-red-500 h-96 -mt-0.5 relative hidden">
      <div class="flex flex-row w-full space-x-16 absolute mt-16 justify-center items-center">
        <div
          class="h-44 w-80 bg-gradient-to-b from-red-400 to-red-500 shadow-lg rounded-lg flex justify-center items-center text-2xl text-white dark:text-slate-900 font-bold">
          Rules
        </div>
        <div
          class="h-44 w-80 bg-gradient-to-b from-red-400 to-red-500 shadow-lg rounded-lg flex justify-center items-center text-2xl text-white dark:text-slate-900 font-bold">
          FAQ
        </div>
        <div
          class="h-44 w-80 bg-gradient-to-b from-red-400 to-red-500 shadow-lg rounded-lg flex justify-center items-center text-2xl text-white dark:text-slate-900 font-bold">
          Guides
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Home extends Vue {
}
</script>

<style scoped>
.background {
  /*noinspection CssUnknownTarget*/
  /*background-image: url('/home1.jpg');*/
  image-rendering: smooth;
  image-resolution: from-image;
  background-size: cover;
  background-repeat: no-repeat;
  height: 100%;
}
</style>
