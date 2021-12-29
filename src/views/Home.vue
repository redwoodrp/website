<template>
  <div class="background h-full flex flex-col">
    <div class="flex flex-col h-full justify-center items-center">
      <div class="text-gray-200 font-black text-5xl">
        RedwoodRP
      </div>
      <div class="text-gray-400 font-medium">
        RedwoodRP is a roleplay BeamMP server network.
      </div>
    </div>

    <div class="flex flex-col items-center mb-16 text-gray-400 opacity-50">
      This website is still in the works. Please stay tuned for updates!
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
  background-image: url('/home1.jpg');
  image-rendering: smooth;
  image-resolution: from-image;
  background-size: cover;
  background-repeat: no-repeat;
  height: 100%;
}
</style>
