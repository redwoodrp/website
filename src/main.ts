import Vue from 'vue';
import Toast from '@/components/Toast.vue';
import App from './App.vue';
import router from './router';
import './index.css';

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
