import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './index.css';
import Toast from '@/components/Toast.vue';

Vue.config.productionTip = false;

if (process.env.NODE_ENV === 'production') {
  console.log = () => undefined;
}

declare module 'vue/types/vue' {
  interface Vue {
    $toast: Toast,
  }
}

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
