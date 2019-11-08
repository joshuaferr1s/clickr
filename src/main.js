import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import { firebaseAuth } from './firebase';

Vue.config.productionTip = false;

let app;

const init = () => {
  if (!app) {
    app = new Vue({
      router,
      store,
      vuetify,
      render: h => h(App),
    }).$mount('#app');
  }
};

firebaseAuth().onAuthStateChanged(async (user) => {
  if (!user) {
    firebaseAuth().signOut();
    store.commit('SET_USER', null);
  } else {
    const { displayName, photoURL, email } = user;
    store.commit('SET_USER', { displayName, photoURL, email });
  }
  init();
});
