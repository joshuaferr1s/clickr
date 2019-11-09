import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import Firebase, { firebaseAuth, db } from './firebase';

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
    await firebaseAuth().signOut();
    store.commit('SET_USER', null);
    router.push('/');
  } else {
    const {
      uid: id, displayName, photoURL, email,
    } = user;
    const doc = await db.collection('users').doc(id).get();
    if (!doc.exists) {
      await Firebase.newUser({
        displayName, photoURL, email, id,
      });
      store.commit('SET_USER', {
        id, displayName, photoURL, email, allowed: false, admin: false,
      });
    } else {
      const allowed = await Firebase.isAllowed(id);
      const admin = await Firebase.isAdmin(id);
      store.commit('SET_USER', {
        id, displayName, photoURL, email, allowed, admin,
      });
    }
  }
  init();
});
