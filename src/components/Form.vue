<template>
  <div class="w-full">
    <div class="element mt-6">
      <div v-if="!editMode" class="flex flex-col">
        <span class="title">{{ form.title }}</span>
        <span class="text-gray-600">{{ form.description }}</span>
        <span class="text-red-500 text-sm mt-4">* Required</span>
      </div>
      <div v-else>
        <input class="title-edit-input -ml-1.5 text-2xl font-semibold" v-model="form.title">
        <input class="title-edit-input -ml-1.5 text-gray-600" v-model="form.description">
      </div>
    </div>

    <div class="element mt-5"
         :class="{ 'red-outline': !field.components.some((comp) => comp.valid) && field.components.length !== 0 }"
         v-for="(field, i) in form.fields"
         :key="i">
      <span class="field-title"
            v-if="!editMode">{{ field.title }}
        <span class="required"
              v-show="field.required">*</span>
      </span>
      <div v-else
           class="flex flex-row">
        <input class="field-title title-edit-input"
               v-model="field.title">

        <button :class="field.required ? 'bg-green-500' : 'bg-red-500'"
                class="rounded-lg p-2 text-xs h-8 mx-1 text-white"
                @click="field.required = !field.required"
                :title="`Field required: ${field.required}`">
          Required
        </button>

        <button
          class="trash-btn"
          title="Delete field"
          @click="deleteField(i)">
          <svg width="24"
               height="24"
               viewBox="0 0 24 24"
               fill="#ff0000">
            <path
              d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" />
          </svg>
        </button>
      </div>
      <div v-for="(component, componentIndex) in field.components"
           :key="componentIndex"
           :class="{ 'mt-2.5': componentIndex >= 1, 'flex flex-wrap w-full': editMode }">
        <!--    TextInput    -->
        <input type="text"
               :placeholder="component.placeholder"
               v-if="component.type === ComponentType.TextInput"
               v-model="component.value"
               @blur="validateField($event, i, componentIndex)"
               :id="`input-${i}-${componentIndex}`"
               class="text-input"
               :class="{ 'text-gray-500': component.disabled }"
               :disabled="component.disabled"
               :title="component.disabled ? 'This field is readonly.' : 'Your answer...'"
               :minlength="component.minLength"
               :maxlength="component.maxLength" />

        <!--   FileInput   -->
        <div v-if="component.type === ComponentType.FileUpload" class="flex flex-row">
          <label :for="`file-upload-${i}-${componentIndex}`"
                 class="custom-file-upload flex flex-row justify-between text-gray-400 border-gray-300 border-b-2 pb-1 mt-1 h-8 w-1/2 cursor-pointer">
            <div class="flex flex-row">
              <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                <path fill="currentColor"
                      d="M16.5,6V17.5A4,4 0 0,1 12.5,21.5A4,4 0 0,1 8.5,17.5V5A2.5,2.5 0 0,1 11,2.5A2.5,2.5 0 0,1 13.5,5V15.5A1,1 0 0,1 12.5,16.5A1,1 0 0,1 11.5,15.5V6H10V15.5A2.5,2.5 0
                    0,0 12.5,18A2.5,2.5 0 0,0 15,15.5V5A4,4 0 0,0 11,1A4,4 0 0,0 7,5V17.5A5.5,5.5 0 0,0 12.5,23A5.5,5.5 0 0,0 18,17.5V6H16.5Z" />
              </svg>

              <span v-if="component.files.length === 0">{{ component.placeholder }}</span>
              <span v-else class="text-gray-500">
                <span v-for="(file, i) in component.files" :key="i">
                  {{ file.name }}
                  <span v-show="i !== component.files.length - 1">, </span>
                </span>
              </span>
            </div>

            <span class="transition-colors cursor-pointer hover:text-red-400 text-gray-300"
                  @click.prevent="component.files = []">
              <svg style="width:24px; height:24px" viewBox="0 0 24 24">
                  <path fill="currentColor"
                        d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
              </svg>
            </span>
          </label>
          <input
            type="file"
            class="hidden"
            :id="`file-upload-${i}-${componentIndex}`"
            :accepts="component.accepts"
            @change="fileUploadChange(i, componentIndex, $event);"
          />
        </div>

        <!--   NumberInput     -->
        <input type="text"
               :placeholder="component.placeholder"
               v-if="component.type === ComponentType.NumberInputComponent"
               v-model="component.value"
               @blur="validateField($event, i, componentIndex)"
               @change="validateNumericInput(i, componentIndex)"
               :id="`input-${i}-${componentIndex}`"
               class="text-input"
               :maxlength="component.maxLength" />

        <!--   Textarea     -->
        <textarea v-else-if="component.type === ComponentType.TextArea"
                  :placeholder="component.placeholder"
                  v-model="component.value"
                  @blur="validateField($event, i, componentIndex)"
                  :id="`input-${i}-${componentIndex}`"
                  class="text-input"
                  :maxlength="component.maxLength" />

        <!--    Checkbox    -->
        <div v-else-if="component.type === ComponentType.Checkbox"
             class="ml-5 flex flex-row items-center">
          <label :for="`checkbox-component-${i}-${componentIndex}`"></label>
          <input :id="`checkbox-component-${i}-${componentIndex}`"
                 type="checkbox"
                 class="transform scale-125 w-6 cursor-pointer h-4" />

          <input class="title-edit-input" v-if="editMode" v-model="component.label">
          <span v-if="!editMode">{{ component.label }}</span>
        </div>

        <!--   Radio Button     -->
        <div v-else-if="component.type === ComponentType.RadioButton">
          <div class="flex flex-col ml-5 items-start"
               v-for="(label, labelIndex) in component.labels"
               :key="labelIndex">
            <div class="mb-1 flex flex-row w-full">
              <input type="radio"
                     :name="`radio-${i}-${componentIndex}`"
                     :id="`radio-${i}-${componentIndex}-${labelIndex}`"
                     :value="label"
                     v-model="component.selected" />
              <div
                v-if="component.showOtherOption && labelIndex === component.labels.length - 1">
                <input class="text-input ml-1" placeholder="Other"
                       v-model="component.labels[labelIndex]" :disabled="editMode"
                       :title="editMode ? 'Disabled in edit mode' : 'Enter other option...'"
                       @change="component.selected = component.labels[labelIndex]">
              </div>
              <div v-if="editMode" class="flex flex-row justify-between w-full">
                <input class="title-edit-input"
                       v-model="field.components[componentIndex].labels[labelIndex]">

                <button
                  class="trash-btn"
                  :title="`Delete '${label}'`"
                  @click="deleteRadio(i, componentIndex, labelIndex)">
                  <svg width="24"
                       height="24"
                       viewBox="0 0 24 24"
                       fill="#ff0000">
                    <path
                      d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" />
                  </svg>
                </button>
              </div>
              <label v-else :for="`radio-${i}-${componentIndex}-${labelIndex}`"
                     class="ml-2"
                     v-show="component.showOtherOption ? component.showOtherOption && labelIndex !== component.labels.length - 1 : true">
                {{ label }}
              </label>
            </div>
          </div>
          <button class="add-component-btn-dense w-24 text-xs"
                  v-if="editMode"
                  title="Add another radio"
                  @click="field.components[componentIndex].labels.push(`Radio ${component.labels.length + 1}`)">
            Add another
          </button>
        </div>

        <!--    DateInput    -->
        <div v-else-if="component.type === ComponentType.DateInput"
             class="flex flex-row space-x-2 items-center text-gray-300">
          <input :placeholder="component.placeholders[0]"
                 class="date-input w-9"
                 v-model="component.values[0]"
                 @change="validateDateInput(i, componentIndex, 0)"
                 maxlength="2">/
          <input :placeholder="component.placeholders[1]"
                 class="date-input w-10"
                 v-model="component.values[1]"
                 @change="validateDateInput(i, componentIndex, 1)"
                 maxlength="2">/
          <input :placeholder="component.placeholders[2]"
                 class="date-input w-14"
                 v-model="component.values[2]"
                 @change="validateDateInput(i, componentIndex, 2)"
                 maxlength="4">
          <span class="text-gray-400">({{
              formatAsDate(`${component.values[1]}/${component.values[0]}/${component.values[2]}`)
            }})</span>
        </div>

        <button
          class="trash-btn ml-3"
          title="Delete component"
          @click="deleteComponent(i, componentIndex)" v-if="editMode">
          <svg width="24"
               height="24"
               viewBox="0 0 24 24"
               fill="#ff0000">
            <path
              d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" />
          </svg>
        </button>

        <span class="flex mt-1 ml-1 text-red-400 text-sm"
              v-show="!component.valid">{{
            component.failHint
          }}</span>

        <AddFormComponentDialog @add="addComponent" :i="i" class="w-full"
                                :component-index="componentIndex"
                                v-if="editMode"></AddFormComponentDialog>
      </div>
      <AddFormComponentDialog @add="addComponent" :i="i" :component-index="null"
                              v-if="field.components.length === 0 && editMode"></AddFormComponentDialog>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  VModel,
  Vue,
  Watch,
} from 'vue-property-decorator';
import {
  Components,
  ComponentType,
  DateInputComponent,
  Fields,
  FileUploadComponent,
  NewField,
  NumberInputComponent,
  RadioButtonComponent,
  TextInputComponent,
} from '@/helpers/formFields';
import AddFormComponentDialog from '@/components/AddFormComponentDialog.vue';

@Component({
  components: {
    AddFormComponentDialog,
  },
})
export default class Form extends Vue {
  @VModel({
    required: true,
    type: Object,
  }) private form!: Fields;
  @Prop() private editMode!: boolean;
  private ComponentType = ComponentType;
  private digitRegex = /^\d+$/g;

  @Watch('form', { deep: true })
  private fieldChange (e: Event) {
    this.$emit('change', e);
  }

  public validateEverything (): boolean {
    let valid = true;

    this.form.fields.forEach((field: NewField, i: number) => {
      field.components.forEach(((readComponent: Components, componentIndex: number) => {
        const component = field.components[componentIndex];

        if (field.required) {
          let el: HTMLInputElement | null = null;
          switch (readComponent.type) {
            case ComponentType.TextInput:
            case ComponentType.TextArea:
            case ComponentType.NumberInputComponent:
              el = document.getElementById(`input-${i}-${componentIndex}`) as HTMLInputElement;
              if (!el) return;

              this.validateField(el, i, componentIndex);
              // if (!component.valid) {
              //   el.scrollIntoView({
              //     block: 'end',
              //     behavior: 'smooth',
              //   });
              // }

              if ((readComponent as TextInputComponent).value.trim().length === 0) {
                valid = false;
                component.valid = false;
                component.failHint = 'This is a required field.';
              }
              break;

            case ComponentType.RadioButton:
              if ((readComponent as RadioButtonComponent).selected.length === 0) {
                valid = false;
                component.valid = false;
                component.failHint = 'This is a required field.';
              }
              break;

            case ComponentType.DateInput:
              if (typeof new Date((readComponent as DateInputComponent).values.join('/')) === 'string') {
                valid = false;
                component.valid = false;
                component.failHint = 'This is a required field.';
              }
              break;

            case ComponentType.FileUpload:
              if (!this.validateFileInput(i, componentIndex)) {
                valid = false;
                component.valid = false;
                component.failHint = 'Wrong filetype';
              } else if ((component as FileUploadComponent).files.length === 0) {
                valid = false;
                component.valid = false;
                component.failHint = 'This is a required field.';
              }

              break;

            default:
              valid = false;
              break;
          }
        } else if (!component.valid) valid = false;
      }));
    });

    if (!valid) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      this.$toast.show('Hm... Something is wrong here. Please check your inputs!');
    }

    return valid;
  }

  private validateNumericInput (index: number, componentIndex: number): void {
    const field = this.form.fields[index];
    const component = field.components[componentIndex] as NumberInputComponent;
    if (component.type !== ComponentType.NumberInputComponent) return;

    if (Number.isNaN(parseInt(component.value, 10))) {
      component.valid = false;
      component.failHint = 'Input can only consist of numeric values.';
      return;
    }

    component.valid = true;
  }

  private validateField (event: Event | HTMLInputElement, index: number, componentIndex: number): void {
    const field = this.form.fields[index];
    const component = field.components[componentIndex] as TextInputComponent;

    if (component.type !== ComponentType.TextInput) return;

    let failHint = '';
    component.rules.some((rule) => {
      if (typeof rule !== 'function') return false;
      const res = rule(component.value);

      if (res !== true) {
        failHint = res as string;
        return true;
      }
      return false;
    });

    const el: HTMLInputElement = 'target' in event ? (event as Event).target as HTMLInputElement : event as HTMLInputElement;

    component.failHint = failHint.length === 0 ? el.validationMessage : failHint;
    component.valid = failHint.length === 0 && el.validity.valid;
  }

  private validateDateInput (index: number, componentIndex: number, valueIndex: number): void {
    const field = this.form.fields[index];
    const component = field.components[componentIndex] as DateInputComponent;
    if (component.type !== ComponentType.DateInput) return;

    if (Number.isNaN(parseInt(component.values[valueIndex], 10)) && component.values[valueIndex] !== '') {
      console.log(component.values[valueIndex]);
      component.valid = false;
      component.failHint = `Input can only consist of numeric values. (${valueIndex})`;
      return;
    }
    component.valid = true;
  }

  private fileUploadChange (index: number, componentIndex: number, event: Event): void {
    const component = this.form.fields[index].components[componentIndex] as FileUploadComponent;
    if (component.type !== ComponentType.FileUpload) return;

    const fileList = (event.target as HTMLInputElement).files;
    if (!fileList) return;

    const files = [...fileList];

    const valid = this.validateFileInput(index, componentIndex, files);

    if (!valid) {
      component.valid = false;
      component.failHint = 'Wrong filetype!';
      component.files = [];
      return;
    }
    component.files = [...files];
    component.valid = true;
    component.failHint = '';
  }

  private validateFileInput (index: number, componentIndex: number, files?: File[]): boolean {
    const component = this.form.fields[index].components[componentIndex] as FileUploadComponent;
    if (component.type !== ComponentType.FileUpload) return false;

    let valid = true;
    (files || component.files).forEach((file) => {
      console.log(file);
      const splitFile = file.name.split('.');
      const endsWith = `.${splitFile[splitFile.length - 1]}`;
      if (!component.accepts.includes(endsWith)) valid = false;
    });

    console.log('valid', valid);

    return valid;
  }

  private deleteField (index: number) {
    if (!this.editMode) return;
    this.form.fields.splice(index, 1);
  }

  private formatAsDate (dateStr: string): string {
    const d = new Date(dateStr);
    if (!this.isValidDate(d)) return 'Invalid date';
    return d.toDateString();
  }

  private isValidDate (d: Date | number | string): boolean {
    return d instanceof Date && !Number.isNaN(d);
  }

  private addComponent (type: ComponentType, index: number, componentIndex: number | null): void {
    this.$emit('addComponent', type, index, componentIndex);
  }

  private deleteComponent (index: number, componentIndex: number): void {
    this.form.fields[index].components.splice(componentIndex, 1);
  }

  private deleteRadio (index: number, componentIndex: number, labelIndex: number): void {
    const field = this.form.fields[index];
    const component = field.components[componentIndex] as RadioButtonComponent;

    if (component.type !== ComponentType.RadioButton) return;

    component.labels.splice(labelIndex, 1);
    if (component.labels.length === 0) field.components.splice(componentIndex, 1);
  }
}
</script>

<style lang="scss"
       scoped>
.element {
  @apply shadow-lg w-full rounded-lg border-t-4 border-blue-500 p-4 flex flex-col mb-8;
  border-right: 1px solid theme('colors.gray.300') !important;
  border-left: 1px solid theme('colors.gray.300') !important;
  border-bottom: 1px solid theme('colors.gray.300') !important;
  border-top: 4px solid theme('colors.blue.500') !important;
}

.title {
  @apply text-2xl font-semibold text-gray-800;
}

.red-outline {
  border-right: red solid 1px !important;
  border-left: red solid 1px !important;
  border-bottom: red solid 1px !important;
  border-top: 4px solid red !important;
}

.field-title {
  @apply font-medium text-xl text-gray-800 mb-2;
}

.title-edit-input {
  @apply transition-colors p-1 border-b-2 border-white focus:border-blue-500 outline-none mt-1 h-8 p-1.5 w-1/2 focus:w-3/5 focus:bg-gray-100;
  width: 100% !important;
}

.required {
  @apply text-red-500;
}

@keyframes widthTransition {
  from {
    width: initial;
  }
  to {
    width: 75%;
  }
}

.date-input {
  @apply p-1 border-b-2 border-gray-300 focus:border-blue-500 outline-none text-gray-700 mx-1;
}

input[type=checkbox] {
  border: none !important;
}

input[type=radio] {
  @apply transform scale-125 cursor-pointer;
}

textarea {
  @apply h-14 max-h-48;
  transition: color, width ease-in-out 180ms !important;
}

input[type=number]::-webkit-outer-spin-button,
input[type=number]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}

.add-component-btn-dense {
  @apply mb-4 ml-10 transition-colors border border-gray-400 rounded-lg h-6 text-gray-500 flex justify-center items-center cursor-pointer hover:bg-gray-400 hover:text-white;
}

.trash-btn {
  @apply transition-all h-10 w-10 flex justify-center items-center border border-gray-200 -mr-2 -mt-1 cursor-pointer hover:bg-gray-200 rounded;
}
</style>
