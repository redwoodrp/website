<template>
  <div class="h-full">
    <div v-if="formState === 0 /* ACTIVE */">
      <Form v-model="form" ref="formElement" />
      <div class="element overflow-x-scroll">
        <div class="field-title">Signature</div>
        <canvas height="140" width="720"
                class="border rounded-lg border-gray-400 overflow-x-auto"
                ref="canvas" />
        <button class="btn bg-gray-400 hover:bg-gray-700 w-full mt-2 mr-0"
                @click="signaturePad.clear()">
          Clear
        </button>
      </div>
      <button class="submit mt-5 mb-96" @click="submitForm">Submit (can't be edited)</button>
    </div>

    <div v-else-if="formState === 1 /* UPLOADING */"
         class="flex justify-center items-center h-screen">
      Uploading...
    </div>

    <div v-else class="container h-full mb-24">
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
            <div class="text-gray-200 p-2 mt-2 bg-gray-600 rounded-lg w-full border border-gray-800">
              {{ error.message }} (Code: {{ error.code }})
            </div>
          </div>
        </div>

        <button @click="initialize();"
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
import SignaturePad from 'signature_pad';
import Form from '@/components/Form.vue';
import {
  Fields,
  FormState,
  RadioButtonComponent,
  TextInputComponent,
} from '@/helpers/formFields';
import User from '@/helpers/interfaces/user';
import feathersClient, { AuthObject, FeathersError } from '@/helpers/feathers-client';
import { DriversLicenseRequest } from '@/helpers/interfaces/driversLicense';

@Component({
  components: { Form },
})
export default class DriversLicense extends Vue {
  private form: Fields = {
    title: 'Drivers license request',
    description: 'This application is for people that want to make a drivers license. Fill it out and you will receive an answer in 1-7 business days.',
    fields: [
      {
        title: 'What\'s your Discord username? (Username + Tag)',
        required: true,
        components: [
          {
            type: 0,
            rules: [],
            value: '',
            valid: true,
            disabled: true,
            failHint: '',
            maxLength: 10,
            minLength: 0,
            placeholder: 'Your answer',
          },
        ],
      },
      {
        title: 'What class do you want to make?',
        required: true,
        components: [
          {
            type: 3,
            showOtherOption: false,
            valid: true,
            failHint: '',
            selected: 'A (Car)',
            labels: [
              'A (Car)',
              'A1 (Car + Trailer)',
              'B (Van)',
              'C (Truck)',
              'C1 (Truck + Trailer)',
              'D (Bus)',
            ],
          },
        ],
      },
      {
        title: 'When do you have time? (e.g.: Sundays, Daily, ...)',
        required: true,
        components: [
          {
            type: 0,
            rules: [],
            value: '',
            valid: true,
            disabled: false,
            failHint: '',
            maxLength: 26,
            minLength: 0,
            placeholder: 'Your answer',
          },
        ],
      },
      {
        title: 'Additional information',
        required: false,
        components: [
          {
            type: 4,
            rules: [],
            value: '',
            valid: true,
            failHint: '',
            maxLength: 64,
            minLength: 0,
            placeholder: 'Your answer',
          },
        ],
      },
    ],
  };
  private formState: FormState = FormState.ACTIVE;
  private canvas: HTMLCanvasElement | null = null;
  private signaturePad: SignaturePad | null = null;
  private user: User | null = null;
  private classMap = {
    'A (Car)': 'A',
    'A1 (Car + Trailer)': 'A1',
    'B (Van)': 'B',
    'C (Truck)': 'C',
    'C1 (Truck + Trailer)': 'C1',
    'D (Bus)': 'D',
  };
  private error: FeathersError | null = null;

  async mounted (): Promise<void> {
    await this.initialize();
  }

  private async initialize (): Promise<void> {
    this.formState = FormState.ACTIVE;

    const canvas = this.$refs.canvas as HTMLCanvasElement;
    if (!canvas) return;
    this.canvas = canvas;

    this.user = (await feathersClient.get('authentication') as AuthObject).user;

    this.signaturePad = new SignaturePad(this.canvas, {
      throttle: 0,
    });
    this.signaturePad.on();

    (this.form.fields[0].components[0] as TextInputComponent).value = `${this.user.username}#${this.user.discriminator}`;
  }

  private async submitForm (): Promise<void> {
    if (!this.user) return;
    if (!this.signaturePad) return;
    if (this.signaturePad.isEmpty()) {
      this.$toast.show('Please sign!');
      return;
    }

    const form = this.$refs.formElement as Form;
    if (!form) return;

    if (form.validateEverything()) {
      this.formState = FormState.UPLOADING;

      const service = feathersClient.service('drivers-license-request');
      try {
        await service.create({
          owner: this.user.discordId.toString(),
          discordName: `${this.user.username}#${this.user.discriminator}`,

          class: this.classMap[(this.form.fields[1].components[0] as RadioButtonComponent).selected as 'A (Car)'],
          hasTime: (this.form.fields[2].components[0] as TextInputComponent).value,
          additionalNotes: (this.form.fields[3].components[0] as TextInputComponent).value,
          signature: this.signaturePad.toDataURL('image/svg+xml'),
        } as DriversLicenseRequest);
      } catch (e) {
        if ((e as FeathersError).code === 1001 /* not-unique */) {
          console.log('error');
          this.formState = FormState.ERROR;
          this.error = {
            ...e,
            message: 'You already have that vehicle class!',
          };
        }
        return;
      }

      this.formState = FormState.SUBMITTED;
    }
  }
}
</script>

<style scoped>
canvas {
  min-width: 720px;
  min-height: 140px;

  max-width: 720px;
  max-height: 140px;
}

.field-title {
  @apply font-medium text-xl text-gray-800 mb-2;
}

.element {
  @apply shadow-lg w-full rounded-lg border-t-4 border-blue-500 p-4 flex flex-col mb-8;
  border-right: 1px solid theme('colors.gray.300') !important;
  border-left: 1px solid theme('colors.gray.300') !important;
  border-bottom: 1px solid theme('colors.gray.300') !important;
  border-top: 4px solid theme('colors.blue.500') !important;
}

.submit {
  @apply transition-all hover:shadow-xl h-20 bg-white rounded-lg w-full mt-4 flex flex-row items-center px-3 flex justify-center items-center text-lg font-medium hover:bg-green-100 active:shadow-none;
  border-right: 1px solid theme('colors.green.500') !important;
  border-left: 1px solid theme('colors.green.500') !important;
  border-bottom: 1px solid theme('colors.green.500') !important;
  border-top: 4px solid theme('colors.green.500') !important;
}

.container {
  @apply mt-8 flex justify-center items-center flex-col;
}
</style>
