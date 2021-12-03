<template>
  <div class="mt-8 w-2/5 flex justify-center items-center flex-col">
    <span class="mt-5 mb-2 text-2xl font-bold text-gray-800 flex justify-center self-center">
      Form Builder
    </span>

    <div class="border border-gray-300 rounded-lg h-32 w-full p-2 px-3">
      <span class="text-xl font-medium flex flex-row justify-center w-full">
        Settings
      </span>

      <div>
        <input class="w-6" type="checkbox" id="editModeEnabled" v-model="editMode">
        <label for="editModeEnabled">Edit mode enabled</label>
      </div>
    </div>

    <Form v-model="form"
          :edit-mode="editMode"
          @addComponent="addComponent" @change="saveLocally" />

    <div class="add-element">
      <button class="text-gray-800 text-lg w-full flex flex-col justify-center items-center py-4"
              @click="addElement">
        <span>Add element</span>
        <span class="text-2xl">+</span>
      </button>
    </div>

    <button class="btn bg-green-500 hover:bg-green-800 mt-5 mb-96" @click="download">Download as
      JSON
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {
  Components,
  ComponentType,
  DateAutoFillType,
  Fields,
} from '@/helpers/formFields';
import Form from '@/components/Form.vue';

@Component({
  components: {
    Form,
  },
})
export default class FormBuilder extends Vue {
  private editMode = true;
  private form: Fields = {
    title: 'Title',
    description: 'Description',
    fields: [
      {
        title: 'Discord Username and Tag (eg.: JustMe#8491)',
        required: false,
        components: [
          {
            type: ComponentType.TextInput,
            rules: [
              (val: string) => /#[0-9]{4}$/g.test(val) || 'Value must include a valid discriminator (#0000)',
            ],
            value: '',
            valid: true,
            disabled: false,
            failHint: '',
            maxLength: 10,
            minLength: 0,
            placeholder: 'Your answer',
          },
          {
            type: ComponentType.DateInput,
            values: [],
            placeholders: ['DD', 'MM', 'YYYY'],
            showDateHint: true,
            autoFillType: DateAutoFillType.Year,
            valid: true,
            failHint: '',
          },
        ],
      },
      {
        title: 'Discord Username and Tag (eg.: JustMe#8491)',
        required: false,
        components: [
          {
            type: ComponentType.TextArea,
            rules: [
              (val: string) => /#[0-9]{4}$/g.test(val) || 'Value must include a valid discriminator (#0000)',
            ],
            value: '',
            valid: true,
            failHint: '',
            maxLength: 10,
            minLength: 2,
            placeholder: 'Your answer',
          },
        ],
      },
      {
        title: 'Date test',
        required: true,
        components: [{
          type: ComponentType.DateInput,
          values: [],
          placeholders: ['DD', 'MM', 'YYYY'],
          showDateHint: true,
          autoFillType: DateAutoFillType.Year,
          valid: true,
          failHint: '',
        }],
      },
      {
        title: 'Seats',
        required: true,
        components: [
          {
            type: ComponentType.Checkbox,
            label: '1',
            value: false,
            valid: true,
            failHint: '',
          },
          {
            type: ComponentType.Checkbox,
            label: '2',
            value: false,
            valid: true,
            failHint: '',
          },
          {
            type: ComponentType.Checkbox,
            label: '3',
            value: false,
            valid: true,
            failHint: '',
          },
          {
            type: ComponentType.Checkbox,
            label: '4',
            value: false,
            valid: true,
            failHint: '',
          },
        ],
      },
      {
        title: 'Radio test',
        required: false,
        components: [{
          type: ComponentType.RadioButton,
          valid: true,
          failHint: '',
          selected: '',
          labels: ['Radio 1', 'Radio 2', 'Radio 3', 'Radio 4'],
        }],
      },
    ],
  };

  mounted (): void {
    // Fetch data from server
    const stored = localStorage.getItem('form');
    if (stored !== null) {
      this.form = JSON.parse(stored);
    }
    this.saveLocally();
  }

  saveLocally (): void {
    localStorage.setItem('form', JSON.stringify(this.form));
  }

  addElement (): void {
    this.form.fields.push({
      title: 'Title',
      required: true,
      components: [],
    });
  }

  addComponent (type: ComponentType, index: number, componentIndex: number | null): void {
    console.log('addComponent ', type, index, componentIndex);

    let pushObj: Components = {
      type: ComponentType.TextInput,
      rules: [],
      value: '',
      valid: true,
      disabled: false,
      failHint: '',
      maxLength: 10,
      minLength: 0,
      placeholder: 'Your answer',
    };
    switch (type) {
      case ComponentType.Checkbox:
        pushObj = {
          type: ComponentType.Checkbox,
          label: '1',
          value: false,
          valid: true,
          failHint: '',
        };
        break;

      case ComponentType.TextArea:
        pushObj = {
          type: ComponentType.TextArea,
          rules: [],
          value: '',
          valid: true,
          failHint: '',
          maxLength: 10,
          minLength: 0,
          placeholder: 'Your answer',
        };
        break;

      case ComponentType.DateInput:
        pushObj = {
          type: ComponentType.DateInput,
          values: [],
          placeholders: ['DD', 'MM', 'YYYY'],
          showDateHint: true,
          autoFillType: DateAutoFillType.Year,
          valid: true,
          failHint: '',
        };
        break;

      case ComponentType.RadioButton:
        pushObj = {
          type: ComponentType.RadioButton,
          showOtherOption: false,
          valid: true,
          failHint: '',
          selected: '',
          labels: ['Radio 1', 'Radio 2', 'Radio 3', 'Radio 4'],
        };
        break;

      case ComponentType.NumberInputComponent:
        pushObj = {
          type: ComponentType.NumberInputComponent,
          rules: [],
          value: '',
          valid: true,
          failHint: '',
          maxLength: 5,
          minLength: 1,
          placeholder: 'HP',
        };
        break;

      default:
        break;
    }

    if (componentIndex === null) {
      this.form.fields[index].components.push({
        ...pushObj,
      });
      this.saveLocally();
      return;
    }

    this.form.fields[index].components.splice(componentIndex + 1, 0, {
      ...pushObj,
    });
    this.saveLocally();
  }

  private download (): void {
    const fileType = 'json';
    const name = 'export';

    console.log(`[RawExport] ${name}.${fileType}: `, this.form);

    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify({ obj: this.form }))}`;
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', `${name}.${fileType}`);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
}
</script>

<style lang="scss"
       scoped>
.add-element {
  @apply transition-all hover:shadow-xl h-20 bg-white rounded-lg w-full mt-4 flex flex-row items-center px-3;
  border-right: 1px solid theme('colors.green.500') !important;
  border-left: 1px solid theme('colors.green.500') !important;
  border-bottom: 1px solid theme('colors.green.500') !important;
  border-top: 4px solid theme('colors.green.500') !important;
}
</style>
