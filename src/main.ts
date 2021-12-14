import Vue from 'vue';
import VueGtag from 'vue-gtag';
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

// Vue.use(VueGtag, {
//   config: {
//     id: 'G-6X6140N67D',
//   },
// });

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
