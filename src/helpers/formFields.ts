export enum ComponentType {
  TextInput = 0,
  Checkbox,
  DateInput,
  RadioButton,
  TextArea,
  NumberInputComponent,
  FileUpload,
  ChipInputComponent
}

export interface BaseComponent {
  type: ComponentType;
  // disabled: boolean;
  valid: boolean;
  failHint: string;
}

export interface CheckboxComponent extends BaseComponent {
  label: string;
  value: boolean;
}

export interface TextInputComponent extends BaseComponent {
  value: string;
  placeholder: string;
  disabled: boolean;
  maxLength: number;
  minLength: number;
  rules: ((val: string) => boolean | string)[];
}

export interface NumberInputComponent extends BaseComponent {
  value: string;
  placeholder: string;
  maxLength: number;
  minLength: number;
  rules: ((val: string) => boolean | string)[];
}

export interface FileUploadComponent extends BaseComponent {
  files: File[];
  placeholder: string;
  accepts: string;
}

export enum DateAutoFillType {
  None = 0,
  Day,
  Month,
  Year,
  All,
  DayMonth,
  DayYear,
  MonthYear,
}

export interface DateInputComponent extends BaseComponent {
  values: string[];
  placeholders: string[];
  showDateHint: boolean;
  autoFillType?: DateAutoFillType;
}

export interface RadioButtonComponent extends BaseComponent {
  selected: string;
  showOtherOption?: boolean;
  labels: string[];
}

export interface ChipInputComponent extends BaseComponent {
  values: string[];
  placeholder: string;
  color: string;
  focused: boolean;
  tmpValue: string;
  maxChips: number;
  maxChipLength: number;
}

export type Components = CheckboxComponent | TextInputComponent | NumberInputComponent | DateInputComponent | RadioButtonComponent | FileUploadComponent | ChipInputComponent;

export interface NewField {
  title: string;
  required: boolean;
  components: Components[];
}

export interface Fields {
  title: string;
  description: string;
  fields: NewField[];
}

export enum FormState {
  ACTIVE,
  UPLOADING,
  SUBMITTED,
  ERROR,
  DONT_SUBMIT_AGAIN,
  LOADING_FORM,
}
