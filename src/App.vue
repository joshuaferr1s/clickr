<template>
  <v-app>
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-flex d-sm-none"></v-app-bar-nav-icon>

      <v-toolbar-title>Clickr</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items v-if="user" class="d-none d-sm-flex">
        <v-btn text to="movies">Movies</v-btn>
        <v-btn text to="account">Account</v-btn>
        <v-btn
          text
          @click="logout"
          :disabled="authenticating"
          :loading="authenticating"
        >
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </v-toolbar-items>
      <v-toolbar-items v-else class="d-none d-sm-flex">
        <v-btn
          text
          @click="login"
          :disabled="authenticating"
          :loading="authenticating"
        >Login With Google</v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <v-navigation-drawer
      app
      v-model="drawer"
      height="100vh"
      disable-resize-watcher
      disable-route-watcher
    >
      <v-list-item v-if="user">
        <v-list-item-avatar>
          <img :src="user.photoURL" alt="user avatar">
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="title">
            {{ user.displayName }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ user.email }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list nav v-if="user">
        <v-list-item link to="movies">
          <v-list-item-icon>
            <v-icon>mdi-movie</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Movies</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="account">
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Account</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn
            v-if="user"
            block
            @click="logout"
            :disabled="authenticating"
            :loading="authenticating"
          >Logout</v-btn>
          <v-btn
            v-else
            block
            @click="login"
            :disabled="authenticating"
            :loading="authenticating"
          >Login With Google</v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
    <app-footer />
  </v-app>
</template>

<script>
import { mapState } from 'vuex';
import Firebase, { firebaseAuth } from './firebase';
import AppFooter from './components/AppFooter.vue';

export default {
  name: 'App',
  components: { AppFooter },
  data: () => ({
    drawer: false,
    authenticating: false,
  }),
  computed: {
    ...mapState(['user']),
  },
  methods: {
    async login() {
      try {
        this.authenticating = true;
        await Firebase.login();
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
      }
      this.authenticating = false;
    },
    async logout() {
      try {
        this.authenticating = true;
        await firebaseAuth().signOut();
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
      }
      this.authenticating = false;
    },
  },
};
</script>
