<template>
  <div v-show="active">
    <div class="overlay" id="modal-overlay" />
    <div class="fixed rounded-lg size bg-white p-4 z-50" :style="`max-width: ${maxWidth}; width: ${width === null ? 'auto': width}`">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component, Prop,
  VModel,
  Vue,
} from 'vue-property-decorator';

@Component
export default class Modal extends Vue {
  @VModel({ type: Boolean }) private active!: boolean;
  @Prop() private maxWidth: string | undefined;
  @Prop() private width: string | undefined;
  @Prop({ default: false, type: Boolean }) private closeOutside: boolean | undefined;
  @Prop({ default: false, type: Boolean }) private closeEsc: boolean | undefined;

  mounted (): void {
    window.addEventListener('click', (event) => {
      if ((event.target as HTMLDivElement).id === 'modal-overlay' && this.closeOutside) {
        this.active = false;
      }
    });

    window.addEventListener('keyup', (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'escape' && this.closeEsc) {
        this.active = false;
      }
    });
  }
}
</script>

<style scoped lang="scss">
@keyframes opacity {
  0% {
    opacity: 0;
  }
  20% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.4;
  }
  80% {
    opacity: 0.6;
  }
  100% {
    opacity: 0.7;
  }
}

.fade {
  transition: opacity ease-in-out 2s;
  animation: opacity ease-in-out;
  animation-duration: 200ms;
  animation-iteration-count: 1;
}

.overlay {
  @extend .fade;
  @apply transition-all duration-300 fixed top-0 right-0 left-0 bottom-0 opacity-70 bg-black h-screen w-screen;
}

.size {
  @extend .fade;
  @apply top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2;
}
</style>
