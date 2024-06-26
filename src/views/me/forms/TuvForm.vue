<template>
  <div class="container" v-if="!formSubmitted">
    <Form v-model="form" ref="formElement" />
    <button class="big-form-submit-btn mt-5 mb-96" @click="submitForm">Submit (can't be edited)</button>
  </div>

  <div v-else-if="illegal.show" class="container h-full mb-24">
    <div>
      <div class="text-5xl text-gray-800 font-bold">Error</div>
      <div class="text-xl text-gray-400 font-medium">
        Something went wrong trying to upload your TÜV form.
      </div>
      <div class="text-gray-700 text-lg font-medium mt-2">
        {{ illegal.error.message }} (Code: {{ illegal.error.code }})
      </div>

      <button @click="formSubmitted = false; illegal = { show: false, error: null }"
              class="btn bg-purple-500 hover:bg-purple-800 mt-4">
        Back to form (without resetting)
      </button>

      <button @click="resetForm(); formSubmitted = false; illegal = { show: false, error: null }"
              class="btn bg-indigo-500 hover:bg-indigo-800 mt-4">
        Back to form (reset)
      </button>
    </div>
  </div>

  <div v-else class="container">
    <div>
      <div class="text-5xl text-gray-800 font-bold dark:text-neutral-300">Thanks!</div>
      <div class="text-gray-700 text-lg font-medium mt-2 dark:text-neutral-500">
        You will receive an answer per Discord in 1-7 work days. If you don't receive a message in
        the
        given time, you won't have to pay for the TÜV. Please remember: Driving without a <span
        class="font-semibold">valid</span> TÜV is <span class="font-semibold">illegal</span>! Even
        if
        you have submitted one.
      </div>

      <button @click="formSubmitted = false"
              class="btn bg-gray-200 text-gray-600 hover:bg-gray-500 hover:text-gray-200 mt-4">
        Back to form (without resetting)
      </button>
      <button @click="resetForm(); formSubmitted = false"
              class="btn bg-indigo-500 hover:bg-indigo-700 mt-4">
        Back to form (reset)
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { v4 as uuidv4 } from 'uuid';
import {
  Components,
  ComponentType, DateInputComponent, Fields,
  NewField, NumberInputComponent, RadioButtonComponent, TextInputComponent,
  FileUploadComponent,
} from '@/helpers/formFields';
import Form from '@/components/Form.vue';
import { hasOwn, TuvFormData } from '@/helpers/generic';
import feathersClient, { AuthObject, FeathersError } from '@/helpers/feathers-client';

interface SaveData {
  field: number,
  component: number,
  value?: string;
  values?: string[];
  selected?: string;
}

interface Illegal {
  show: boolean;
  error: FeathersError | null;
}

@Component({
  components: {
    Form,
  },
})
export default class TuvForm extends Vue {
  private form: Fields = {
    title: 'TÜV License Request',
    description: 'Get a tüv for your car for a low fee. You will receive your TÜV in 1-7 work days.',
    fields: [
      {
        title: 'Discord Username and Tag (eg.: JustMe#8491)',
        required: true,
        components: [
          {
            type: ComponentType.TextInput,
            rules: [
              (val: string) => /#[0-9]{4}$/g.test(val) || 'Value must include a valid discriminator (#0000)',
              (val: string) => val.length >= 7 || 'Value must be at least 7 characters long',
            ],
            value: 'Loading...',
            valid: true,
            disabled: true,
            failHint: '',
            maxLength: 32,
            minLength: 2,
            placeholder: 'Your answer',
          },
        ],
      },
      {
        title: 'License Plate',
        required: true,
        components: [
          {
            type: ComponentType.TextInput,
            rules: [],
            value: '',
            valid: true,
            disabled: false,
            failHint: '',
            maxLength: 16,
            minLength: 2,
            placeholder: 'Your answer',
          },
        ],
      },
      {
        title: 'First registry date (if this is the first registry; leave empty)',
        required: false,
        components: [
          {
            type: ComponentType.DateInput,
            values: ['', '', ''],
            placeholders: [
              'DD',
              'MM',
              'YYYY',
            ],
            showDateHint: true,
            valid: true,
            failHint: '',
          },
        ],
      },
      {
        title: 'Brand/Make (eg.: Gavril)',
        required: true,
        components: [
          {
            type: ComponentType.TextInput,
            rules: [],
            value: '',
            valid: true,
            disabled: false,
            failHint: '',
            maxLength: 26,
            minLength: 3,
            placeholder: 'Your answer',
          },
        ],
      },
      {
        title: 'Model (eg.: Roamer)',
        required: true,
        components: [
          {
            type: ComponentType.TextInput,
            rules: [],
            value: '',
            valid: true,
            disabled: false,
            failHint: '',
            maxLength: 32,
            minLength: 1,
            placeholder: 'Your answer',
          },
        ],
      },
      {
        title: 'Vehicle type',
        required: true,
        components: [
          {
            type: ComponentType.RadioButton,
            valid: true,
            failHint: '',
            selected: 'Car',
            labels: [
              'Car',
              'Van',
              'Bus',
              'Truck',
            ],
          },
        ],
      },
      {
        title: 'Engine type (eg.: 4.1L i6)',
        required: true,
        components: [
          {
            type: ComponentType.TextInput,
            rules: [],
            value: '',
            valid: true,
            disabled: false,
            failHint: '',
            maxLength: 16,
            minLength: 2,
            placeholder: 'Your answer',
          },
        ],
      },
      {
        title: 'Engine horsepower',
        required: true,
        components: [
          {
            type: ComponentType.NumberInputComponent,
            rules: [],
            value: '',
            valid: true,
            failHint: '',
            maxLength: 5,
            minLength: 1,
            placeholder: 'HP',
          },
        ],
      },
      {
        title: 'Engine ccm (eg.: 4500)',
        required: true,
        components: [
          {
            type: ComponentType.NumberInputComponent,
            rules: [],
            value: '',
            valid: true,
            failHint: '',
            maxLength: 5,
            minLength: 1,
            placeholder: 'CCM',
          },
        ],
      },
      {
        title: 'Fuel type (eg.: Gasoline)',
        required: true,
        components: [
          {
            type: ComponentType.RadioButton,
            valid: true,
            failHint: '',
            selected: 'Gasoline',
            labels: [
              'Gasoline',
              'Diesel',
              'Electric',
            ],
          },
        ],
      },
      {
        title: 'Transmission and gears (eg.: 6-Speed automatic)',
        required: true,
        components: [
          {
            type: ComponentType.TextInput,
            rules: [],
            value: '',
            valid: true,
            disabled: false,
            failHint: '',
            maxLength: 24,
            minLength: 8,
            placeholder: 'Your answer',
          },
        ],
      },
      {
        title: 'Body type',
        required: true,
        components: [
          {
            type: ComponentType.RadioButton,
            showOtherOption: true,
            valid: true,
            failHint: '',
            selected: 'Sedan',
            labels: [
              'Sedan',
              'SUV',
              'Van',
              'Pickup',
              'Semi',
              'Heavy duty',
              'SUV Extended',
              'Unibody',
              '',
            ],
          },
        ],
      },
      {
        title: 'Color (eg.: Jet Black)',
        required: true,
        components: [
          {
            type: ComponentType.TextInput,
            rules: [],
            value: '',
            valid: true,
            disabled: false,
            failHint: '',
            maxLength: 24,
            minLength: 2,
            placeholder: 'Your answer',
          },
        ],
      },
      {
        title: 'Weight (kg)',
        required: true,
        components: [
          {
            type: ComponentType.NumberInputComponent,
            rules: [],
            value: '',
            valid: true,
            failHint: '',
            maxLength: 8,
            minLength: 1,
            placeholder: 'kg',
          },
        ],
      },
      {
        title: 'Seats',
        required: true,
        components: [
          {
            type: ComponentType.RadioButton,
            showOtherOption: false,
            valid: true,
            failHint: '',
            selected: '1',
            labels: [
              '1',
              '2',
              '3',
              '4',
              '5',
              '6',
              '7',
              '8 or more',
            ],
          },
        ],
      },
      {
        title: 'Year (eg.: 1999)',
        required: true,
        components: [
          {
            type: ComponentType.NumberInputComponent,
            rules: [],
            value: '',
            valid: true,
            failHint: '',
            maxLength: 4,
            minLength: 4,
            placeholder: 'Your Answer',
          },
        ],
      },
      {
        title: 'Additional Information (Modifications, ...)',
        required: false,
        components: [
          {
            type: ComponentType.TextArea,
            rules: [],
            value: '',
            valid: true,
            failHint: '',
            maxLength: 2000,
            minLength: 0,
            placeholder: 'Your answer',
          },
        ],
      },
      {
        title: 'Upload vehicle file',
        required: true,
        components: [
          {
            type: ComponentType.FileUpload,
            files: [],
            placeholder: 'Upload file',
            accepts: '.pc',
            valid: true,
            failHint: '',
          } as FileUploadComponent,
        ],
      },
    ],
  };
  private saveKey = 'forms-tuv-save-data';
  private formSubmitted = false;
  private illegal: Illegal = {
    show: false,
    error: null,
  };
  private vehicleCategoryMap = ['car', 'van', 'bus', 'truck'];

  async mounted (): Promise<void> {
    const { user }: AuthObject = await feathersClient.get('authentication');
    console.log(user);
    (this.form.fields[0].components[0] as TextInputComponent).value = `${user.username}#${user.discriminator}`;

    try {
      const storedSaved = localStorage.getItem(this.saveKey);
      if (!storedSaved) return;
      const saveData = JSON.parse(storedSaved) as SaveData[];

      saveData.forEach((save: SaveData) => {
        const component = this.form.fields[save.field].components[save.component];
        if (save.value) {
          (component as TextInputComponent).value = save.value;
        } else if (save.values) {
          (component as DateInputComponent).values = save.values;
        } else if (save.selected) {
          const radio = (component as RadioButtonComponent);

          if (!radio.labels.includes(save.selected)) {
            radio.labels[radio.labels.length - 1] = save.selected;
          }

          radio.selected = save.selected;
        }
      });
    } catch (err) {
      console.log('Error loading save data: ', err);
      localStorage.removeItem(this.saveKey);
    }
  }

  @Watch('form', { deep: true })
  fieldsChanged (): void {
    const saveData: SaveData[] = [];

    this.form.fields.forEach((field: NewField, i: number) => {
      field.components.forEach((component: Components, componentIndex: number) => {
        const data: SaveData = {
          field: i,
          component: componentIndex,
        };

        if (i === 0 && componentIndex === 0) return; // Prevent user from editing name through localStorage

        if (hasOwn(component, 'value')) {
          data.value = (component as TextInputComponent).value;
        } else if (hasOwn(component, 'values')) {
          data.values = (component as DateInputComponent).values;
        } else if (hasOwn(component, 'selected')) {
          data.selected = (component as RadioButtonComponent).selected;
        }

        saveData.push(data);
      });
    });

    localStorage.setItem(this.saveKey, JSON.stringify(saveData));
  }

  private resetForm (): void {
    localStorage.removeItem(this.saveKey);
    window.location.reload();
  }

  async submitForm (): Promise<void> {
    const formElement = (this.$refs.formElement as Form);
    const formValid = formElement.validateEverything();
    console.log('everything valid: ', formValid);

    if (!formValid) return;

    let firstRegistryDate: string | Date | null = new Date((this.form.fields[2].components[0] as DateInputComponent).values.join('/'));
    if (Number.isNaN(firstRegistryDate.getTime())) {
      firstRegistryDate = new Date().toISOString();
    } else {
      firstRegistryDate = new Date(firstRegistryDate).toISOString();
    }
    console.log(firstRegistryDate);

    const { user }: AuthObject = await feathersClient.get('authentication');
    const service = feathersClient.service('tuv-forms');

    interface TuvFormDataServer extends TuvFormData {
      fileData: string;
    }

    const fileData = await this.readFile((this.form.fields[17].components[0] as FileUploadComponent).files[0]);

    console.log((this.form.fields[5].components[0] as RadioButtonComponent).selected.toLowerCase());

    await service.create({
        owner: user.discordId,
        discordName: (this.form.fields[0].components[0] as TextInputComponent).value,
        licensePlate: (this.form.fields[1].components[0] as TextInputComponent).value,
        firstRegistry: firstRegistryDate,
        vehicleBrand: (this.form.fields[3].components[0] as TextInputComponent).value,
        vehicleModel: (this.form.fields[4].components[0] as TextInputComponent).value,
        vehicleCategory: (this.form.fields[5].components[0] as RadioButtonComponent).selected.toLowerCase(),
        engineType: (this.form.fields[6].components[0] as TextInputComponent).value,
        engineHorsepower: parseInt((this.form.fields[7].components[0] as NumberInputComponent).value, 10),
        engineCCM: parseInt((this.form.fields[8].components[0] as NumberInputComponent).value, 10),
        fuelType: (this.form.fields[9].components[0] as RadioButtonComponent).selected,
        transmission: (this.form.fields[10].components[0] as TextInputComponent).value,
        bodyType: (this.form.fields[11].components[0] as RadioButtonComponent).selected,
        vehicleColor: (this.form.fields[12].components[0] as TextInputComponent).value,
        vehicleWeight: parseInt((this.form.fields[13].components[0] as NumberInputComponent).value, 10),
        vehicleSeatsAmount: parseInt((this.form.fields[14].components[0] as RadioButtonComponent).selected, 10),
        vehicleYear: (this.form.fields[15].components[0] as NumberInputComponent).value,
        additionalInfos: (this.form.fields[16].components[0] as TextInputComponent).value,
        tid: uuidv4(),
        fileData,
      } as TuvFormDataServer)
      .catch((e: FeathersError) => {
//        throw e;
        console.log('error while trying to create tuv: ', e.code);
        if (e.code === 1000) {
          this.illegal = {
            show: true,
            error: e,
          };
        }
      });

    this.formSubmitted = true;
  }

  private async readFile (f: File): Promise<string | Error> {
    return new Promise<string | Error>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => resolve(e.target?.result?.toString() || '');
      reader.onerror = (e) => reject(e);

      reader.readAsText(f);
    });
  }
}
</script>

<style lang="scss"
       scoped>
.container {
  @apply mt-8 flex justify-center items-center flex-col;
}
</style>
