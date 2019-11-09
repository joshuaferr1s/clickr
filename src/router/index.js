import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';
import Home from '../views/Home.vue';
import Movies from '../views/Movies.vue';
import Record from '../views/Record.vue';
import Account from '../views/Account.vue';
import Unauthorized from '../views/Unauthorized.vue';

Vue.use(VueRouter);

const requiresAuth = (to, from, next) => {
  if (store.state.user.allowed) {
    next();
  } else {
    next('/unauthorized');
  }
};

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/movies',
    name: 'movies',
    component: Movies,
    beforeEnter: requiresAuth,
  },
  {
    path: '/record/:id',
    name: 'record',
    component: Record,
    beforeEnter: requiresAuth,
  },
  {
    path: '/account',
    name: 'account',
    component: Account,
    beforeEnter: requiresAuth,
  },
  {
    path: '/*',
    name: 'unauthorized',
    component: Unauthorized,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
