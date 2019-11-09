<template>
  <v-card>
    <v-card-title>
      <v-list-item two-line>
        <v-list-item-avatar>
          <v-img class="elevation-6" :src="user.photoURL"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ user.displayName }}</v-list-item-title>
          <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card-title>
    <v-card-text>
      <v-alert
        v-model="alert.show"
        :type="alert.type"
        border="left"
        dismissible
        @input="setAlert(false, null, null)"
      >
        {{ alert.message }}
      </v-alert>
      <v-layout row wrap>
        <v-flex xs12 sm6 class="d-flex justify-center">
          <v-switch
            v-model="user.allowed"
            @change="updateAllowed"
            :label="user.allowed ? 'Allowed' : 'Not Allowed'"
            :disabled="!authedUser.admin"
            inset
          ></v-switch>
        </v-flex>
        <v-flex xs12 sm6 class="d-flex justify-center">
          <v-switch
            v-model="user.admin"
            @change="updateAdmin"
            :label="user.admin ? 'Admin' : 'Not an Admin'"
            :disabled="!authedUser.admin"
            inset
          ></v-switch>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
import Firebase from '../firebase';

export default {
  name: 'user-card',
  props: ['user'],
  data: () => ({
    alert: {
      show: false,
      type: null,
      message: null,
    },
  }),
  computed: {
    authedUser() {
      return this.$store.state.user;
    },
  },
  methods: {
    setAlert(show, type, message) {
      this.alert.show = show;
      this.alert.type = type;
      this.alert.message = message;
    },
    async updateAllowed(value) {
      try {
        const result = await Firebase.updateAllowed({ id: this.user.id, allowed: value });
        if (result.message) throw new Error(result.message);
      } catch (error) {
        this.setAlert(true, 'error', error.message);
      }
    },
    async updateAdmin(value) {
      try {
        const result = await Firebase.updateAdmin({ id: this.user.id, admin: value });
        if (result.message) throw new Error(result.message);
      } catch (error) {
        this.setAlert(true, 'error', error.message);
      }
    },
  },
};
</script>
