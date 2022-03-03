<template>
  <div class="h-full">
    <div v-if="formState === 0 /* ACTIVE */" class="mt-8">
      <Form v-model="form" ref="form"></Form>
      <button class="submit mt-5 mb-96" @click="submitForm">Submit</button>
    </div>

    <div v-else-if="formState === 1 /* UPLOADING */"
         class="flex justify-center items-center h-screen">
      Uploading...
    </div>

    <div v-else class="container h-full">
      <div>
        <div v-if="formState !== 3 /* ERROR */">
          <div class="text-5xl text-gray-800 font-bold">Thanks!</div>
          <div class="text-gray-700 text-lg font-medium mt-2">
            You will receive an answer by one of our driver license instructors in 1-7 business
            days.
            Remember: Just submitting this form does <span class="font-bold">not</span> allow you to
            drive. You will have to pass a test too. Have patience and fun!
          </div>
        </div>

        <div v-else>
          <div class="text-5xl text-gray-800 font-bold">Error</div>
          <div class="text-gray-700 text-lg font-medium mt-2">
            Something went wrong trying to upload the information. Response from server:
            <div
              class="text-gray-200 p-2 mt-2 bg-gray-600 rounded-lg w-full border border-gray-800">
              {{ error.message }} (Code: {{ error.code }})
            </div>
          </div>
        </div>

        <button @click="formState = 0"
                class="btn bg-gray-200 text-gray-600 hover:bg-gray-500 hover:text-gray-200 mt-4">
          Back to form
        </button>
        <router-link to="/me"
                     class="btn bg-indigo-500 hover:bg-indigo-700 mt-4 select-none">
          Back to user dashboard
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Form from '@/components/Form.vue';
import {
  ChipInputComponent,
  ComponentType,
  FormState,
  TextInputComponent,
} from '@/helpers/formFields';
import feathersClient, { AuthObject, FeathersError } from '@/helpers/feathers-client';
import { BusinessRequest } from '@/helpers/interfaces/business';
import User from '@/helpers/interfaces/user';

@Component({
  components: { Form },
})
export default class Apply extends Vue {
  private user: User | null = null;
  private form = {
    title: 'Register Your Business',
    description: 'We will reply in 1-7 business days. Have questions? DM JustMe#8491',
    fields: [
      {
        title: 'What\'s your Discord username? (Username + Tag)',
        required: true,
        components: [
          {
            type: 0,
            rules: [],
            value: 'Loading...',
            valid: true,
            disabled: true,
            failHint: '',
            maxLength: 36,
            minLength: 0,
            placeholder: 'Your answer',
          },
        ],
      },
      {
        title: 'Who are your employees? (eg. JustMe#8491, vlad#1000)',
        required: true,
        components: [
          {
            type: ComponentType.ChipInputComponent,
            rules: [],
            values: [],
            tmpValue: '',
            valid: true,
            failHint: '',
            maxLength: 256,
            minLength: 0,
            placeholder: 'Your answer',
            color: 'bg-blue-600',
            focused: false,
            maxChips: 12,
            maxChipLength: 26,
          },
        ],
      },
      {
        title: 'What\'s the name of your business?',
        required: true,
        components: [
          {
            type: 0,
            rules: [],
            value: '',
            valid: true,
            disabled: false,
            failHint: '',
            maxLength: 32,
            minLength: 0,
            placeholder: 'Your answer',
          },
        ],
      },
      {
        title: 'What abbreviation does your business use?',
        required: true,
        components: [
          {
            type: 0,
            rules: [],
            value: '',
            valid: true,
            disabled: false,
            failHint: '',
            maxLength: 12,
            minLength: 0,
            placeholder: 'Your answer',
          },
        ],
      },
    ],
  };
  private formState = FormState.ACTIVE;
  private error = {
    message: 'Unknown',
    code: Math.PI,
  };

  async mounted (): Promise<void> {
    this.user = (await feathersClient.get('authentication') as AuthObject).user;
    if (!this.user) return;
    console.log(this.user);
    (this.form.fields[0].components[0] as TextInputComponent).value = `${this.user.username}#${this.user.discriminator}`;
  }

  private async submitForm (): Promise<void> {
    try {
      if (!this.user) return;

      if ((this.$refs.form as Form).validateEverything()) {
        this.formState = FormState.UPLOADING;
        await feathersClient.service('business-request')
          .create({
            ownerId: this.user.discordId,
            owner: (this.form.fields[0].components[0] as unknown as TextInputComponent).value,
            members: (this.form.fields[1].components[0] as unknown as ChipInputComponent).values
              .map((n: string) => n.trim()),
            name: (this.form.fields[2].components[0] as unknown as TextInputComponent).value,
            abbreviation: (this.form.fields[3].components[0] as unknown as TextInputComponent).value,
          } as BusinessRequest);

        this.formState = FormState.SUBMITTED;
      }
    } catch (e) {
      console.log('Error while uploading document: ', e);
      this.formState = FormState.ERROR;
      this.error = {
        message: (e as FeathersError).message,
        code: (e as FeathersError).code,
      };
    }
  }
}
</script>

<style scoped>
.submit {
  @apply transition-all hover:shadow-xl h-20 bg-white rounded-lg w-full mt-4 flex flex-row items-center px-3 flex justify-center items-center text-lg font-medium hover:bg-green-100 active:shadow-none;
  border-right: 1px solid theme('colors.green.500') !important;
  border-left: 1px solid theme('colors.green.500') !important;
  border-bottom: 1px solid theme('colors.green.500') !important;
  border-top: 4px solid theme('colors.green.500') !important;
}

.container {
  @apply flex justify-center items-center flex-col;
}
</style>
