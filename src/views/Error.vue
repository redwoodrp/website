<template>
  <div class="text-center flex items-center flex-col h-4/5 justify-between">
    <div/>
    <div>
      <div class="text-8xl font-bold text-gray-700 mt-5">{{ code }}</div>
      <div class="text-gray-500 mt-3 text-xl font-medium">
        {{ errorMap[code] === undefined ? errorMap.default : errorMap[code] }}
      </div>
    </div>
    <router-link class="transition-all cursor-pointer text-gray-400 font-bold hover:text-gray-600" to="/">Back home</router-link>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Error extends Vue {
  @Prop({ required: false }) private code: string | undefined;
  private errorMap = {
    400: 'Bad request',
    403: 'Insufficient permission',
    404: 'Resource not found',
    410: 'Gone',
    429: 'Too many requests',
    418: 'I\'m a teapot',
    500: 'Internal server error',
    default: 'Something unexpected just happened',
  };
}
</script>
