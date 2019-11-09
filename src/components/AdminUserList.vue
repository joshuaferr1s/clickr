<template>
  <v-row>
    <v-col v-for="user in users" :key="user.id" xs="12" sm="6">
      <user-card :user="user" />
    </v-col>
  </v-row>
</template>

<script>
import Firebase from '../firebase';
import UserCard from './UserCard.vue';

export default {
  name: 'admin-user-list',
  components: {
    UserCard,
  },
  data: () => ({
    users: [],
  }),
  async created() {
    try {
      this.users = await Firebase.getUsers();
    } catch (error) {
      this.users = [];
    }
  },
};
</script>
