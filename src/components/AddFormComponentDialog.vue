<template>
  <div
    class="border border-gray-400 rounded-lg p-2 my-2 text-gray-500 flex flex-col items-center">
    <span>Add</span>
    <div class="w-full flex flex-row space-x-2">
      <button class="add-component-btn"
              @click="emit(ComponentType.NumberInputComponent, i, componentIndex)">
        NumberInput
      </button>
      <button class="add-component-btn"
              @click="emit(ComponentType.TextInput, i, componentIndex)">
        TextInput
      </button>
      <button class="add-component-btn"
              @click="emit(ComponentType.TextArea, i, componentIndex)">
        Paragraph
      </button>
      <button class="add-component-btn"
              @click="emit(ComponentType.DateInput, i, componentIndex)">
        DateInput
      </button>
      <button class="add-component-btn"
              @click="emit(ComponentType.RadioButton, i, componentIndex)">
        Radio
      </button>
      <button class="add-component-btn"
              @click="emit(ComponentType.Checkbox, i, componentIndex)">
        Checkbox
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ComponentType } from '@/helpers/formFields';

@Component
export default class AddFormComponentDialog extends Vue {
  private ComponentType = ComponentType;
  @Prop() private i!: number;
  @Prop() private componentIndex!: number | null;

  emit (type: ComponentType, i: number, componentIndex: number): void {
    this.$emit('add', type, i, componentIndex);
  }
}
</script>

<style scoped>
.add-component-btn {
  @apply mt-3 transition-colors border border-gray-400 rounded-lg w-full h-8 text-gray-500 flex justify-center items-center cursor-pointer hover:bg-gray-400 hover:text-white;
}
</style>
