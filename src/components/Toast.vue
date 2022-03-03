<template>
  <div
    class="fixed bottom-0 right-0 size bg-neutral-800 mr-5 mb-5 rounded shadow-lg flex items-center px-3.5 text-gray-100 flex justify-between hidden py-0.5"
    ref="mainContainer">
    <span class="py-1.5 break-words" style="hyphens: auto">{{ message }}</span>
    <button
      class="btn-text transition-colors hover:bg-opacity-20 rounded m-1 hover:bg-blue-500 text-blue-500 font-semibold justify-center items-center p-1.5 -mr-2 ml-6"
      @click="close">
      Close
    </button>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
} from 'vue-property-decorator';

export interface ToastOptions {
  timeout?: number;
}

@Component
export default class Toast extends Vue {
  @Prop() private timeout: number | undefined;
  private runningTimeouts: number[] = [];
  private message = 'Loading';

  public show (message: string, options?: ToastOptions): void {
    const el = (this.$refs.mainContainer as HTMLDivElement);
    el.style.display = 'flex';
    el.classList.add('toast-fade-in');
    this.message = message;

    this.runningTimeouts.push(
      setTimeout(() => {
        el.classList.remove('toast-fade-in');
      }, 210) as unknown as number,
    );

    this.runningTimeouts.push(
      setTimeout(() => {
        this.close();
      }, options?.timeout || 2500) as unknown as number,
    );
  }

  public close (): void {
    const el = (this.$refs.mainContainer as HTMLDivElement);
    el.classList.add('toast-fade-out');

    this.runningTimeouts.forEach((timeout) => clearTimeout(timeout));

    this.runningTimeouts.push(
      setTimeout(() => {
        this.message = 'Loading';
        el.style.display = 'none';
        el.classList.remove('toast-fade-in');
        el.classList.remove('toast-fade-out');
      }, 210) as unknown as number,
    );
  }
}
</script>

<style lang="scss">
.toast-fade-out {
  animation-iteration-count: 1;
  animation: fadeOut ease-in-out 200ms;
}

.toast-fade-in {
  animation-iteration-count: 1;
  animation: fadeOut ease-in-out reverse 200ms;
}

@keyframes fadeOut {
  from {
    opacity: 100%;
  }
  to {
    opacity: 0;
  }
}
</style>

<style scoped>
.size {
  min-width: 23rem;
  max-width: 40rem;
}
</style>
