<template>
  <div class="flex justify-center items-center mt-8">
    <div class="container rounded-lg shadow-lg p-3">
      <div class="modal-title">Feedback</div>
      <div class="modal-description">
        Your username will automatically be sent with the feedback.
      </div>

      <textarea name="message" cols="30" rows="10"
                placeholder="Message" class="textarea mt-2" v-model="message" />

      <button class="btn bg-indigo-500 hover:bg-indigo-800 w-full mt-2" @click="sendFeedback">
        Send
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import feathersClient, { AuthObject } from '@/helpers/feathers-client';
import User from '@/helpers/interfaces/user';

@Component
export default class Feedback extends Vue {
  private message = '';
  private user: User | null = null;

  async mounted (): Promise<void> {
    this.user = (await feathersClient.get('authentication') as AuthObject).user;
  }

  private async sendFeedback (): Promise<void> {
    if (!this.user) return;

    await feathersClient.service('feedback')
      .create({
        message: this.message,
        userId: this.user.discordId,
      });
  }
}
</script>

<style lang="scss" scoped>
.container {
  border-right: 1px solid theme('colors.indigo.500') !important;
  border-left: 1px solid theme('colors.indigo.500') !important;
  border-bottom: 1px solid theme('colors.indigo.500') !important;
  border-top: 4px solid theme('colors.indigo.500') !important;
}
</style>
