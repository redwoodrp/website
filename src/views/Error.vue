<template>
  <div class="h-full flex flex-col">
    <div class="flex flex-col items-center h-full justify-center">
      <div class="text-8xl font-bold text-gray-700 mt-5">{{ code }}</div>
      <div class="text-gray-500 mt-3 text-xl font-medium text-center">
        {{ errorMap[code] === undefined ? errorMap.default : errorMap[code] }}
      </div>
    </div>

    <router-link class="transition-all cursor-pointer text-gray-400 font-bold hover:text-gray-600 flex flex-col mb-16 items-center"
                 to="/">
      Back home
    </router-link>
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
    11000: 'Authentication is currently disabled while we finish this website. For the time being, you cannot get a fine for not having a TÜV or a driver\'s license.',
    default: 'Something unexpected just happened',
  };
}
</script>
