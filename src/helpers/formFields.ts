export enum ComponentType {
  TextInput = 0,
  Checkbox,
  DateInput,
  RadioButton,
  TextArea,
  NumberInputComponent,
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

export type Components = CheckboxComponent | TextInputComponent | NumberInputComponent | DateInputComponent | RadioButtonComponent;

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
