<template>
  <v-container>
    <v-layout row justify-center>
      <user-card xs12 sm4 md3 :user="user" />
    </v-layout>
    <admin-user-list v-if="user.admin" />
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import UserCard from '../components/UserCard.vue';
import AdminUserList from '../components/AdminUserList.vue';

export default {
  name: 'account',
  components: {
    UserCard,
    AdminUserList,
  },
  data: () => ({
    isAllowed: true,
    isAdmin: true,
  }),
  computed: {
    ...mapState(['user']),
  },
};
</script>
