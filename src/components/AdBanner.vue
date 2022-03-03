<template>
  <div
    class="transition-all hover:scale-105 rounded-lg border border-gray-200 h-48 cursor-pointer hover:shadow-xl flex flex-row text-gray-800 static"
    :class="{'shadow-lg': shadow }"
    v-if="ad.show">
    <button @click="bringToPage" v-if="!editMode" class="absolute w-full h-full" />

    <router-link
      class="underline transition-colors hover:text-gray-600 text-xs text-gray-400 bottom-0 right-0 mx-0.5 mb-0.5 absolute select-none"
      to="/legal/ads">
      Learn more about ads
    </router-link>

    <img
      :src="ad.imageSource"
      class="h-48 rounded-l-lg w-full rounded-lg"
      :alt="editMode ? 'Here will be the uploaded image': 'Advertisement'" ref="img">
    <div v-if="editMode"
         class="flex justify-center items-center w-full transition-all absolute text-center h-full">
      <button
        class="bg-black bg-opacity-20 p-3 rounded-xl text-center text-white flex justify-center items-center flex-col hover:bg-opacity-60 transition-all"
        @click.prevent="chooseImage">
        Upload Image
        <svg style="width:24px;height:24px" viewBox="0 0 24 24">
          <path fill="currentColor" d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" />
        </svg>
      </button>
    </div>
    <div class="p-1 ml-2" v-if="ad.showDescription || ad.showTitle">
      <div class="text-2xl font-semibold" v-if="ad.showTitle">
        <span v-if="!editMode">{{ ad.title }}</span>
        <span v-else>
          <input type="text" name="Title" id="ad-title" v-model="ad.title"
                 class="text-2xl font-semibold text-gray-800 bg-blue-50 border-blue-100">
        </span>
      </div>
      <div class="text-sm text-gray-600" v-if="ad.showDescription">
        <span v-if="!editMode">{{ ad.description }}</span>
        <span v-else>
          <textarea name="Description" id="ad-description" cols="45" rows="5"
                    class="resize-none bg-blue-50 border border-blue-100" v-model="ad.description">Hello</textarea>
        </span>
      </div>
    </div>

    <button
      class="absolute top-0 right-0 text-gray-400 mt-1 right-px hover:bg-red-500 transition-all rounded-lg hover:text-white fixed"
      @click="ad.show = false">
      <svg style="width:24px;height:24px" viewBox="0 0 24 24">
        <path fill="currentColor"
              d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z" />
      </svg>
    </button>

    <input type="file" name="choose file" ref="chooseFile" accept="image/jpeg" class="fixed"
           style="opacity: 0; color: rgba(0,0,0,0)">
  </div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  VModel,
  Vue,
} from 'vue-property-decorator';
import { Ad } from '@/helpers/generic';

@Component
export default class AdBanner extends Vue {
  @VModel({
    required: false,
    type: Object,
  }) private ad!: Ad;
  @Prop() private editMode!: boolean;
  @Prop() private shadow!: boolean;
  public imgEl: HTMLImageElement | null = null;

  mounted (): void {
    this.imgEl = this.$refs.img as HTMLImageElement;
  }

  chooseImage (): void {
    const chooseFileEl = this.$refs.chooseFile as HTMLInputElement;
    chooseFileEl.click();
    chooseFileEl.onchange = () => {
      if (!chooseFileEl.files) return;
      if (chooseFileEl.files.length === 0 || chooseFileEl.files.length > 1) return;

      this.$emit('imgChange', this.imgEl);

      Object.values(chooseFileEl.files)
        .forEach((f) => {
          console.log(f);
          this.ad.imageSource = URL.createObjectURL(f);
        });
    };
  }

  private bringToPage (): void {
    window.open(`https://rdwrp.com${this.ad.to}`);
  }
}
</script>
