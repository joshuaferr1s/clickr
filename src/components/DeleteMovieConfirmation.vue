<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on }">
      <v-icon
        small
        color="error"
        v-on="on"
      >
        mdi-delete
      </v-icon>
    </template>
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>Delete {{ movie }}?</v-card-title>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="dialog = false">Cancel</v-btn>
        <v-btn color="error" text @click="deleteMovie()">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Firebase from '../firebase';

export default {
  name: 'delete-movie-confirmation',
  props: ['id', 'movie'],
  data: () => ({
    dialog: false,
  }),
  methods: {
    async deleteMovie() {
      try {
        await Firebase.deleteMovie(this.id);
      } catch (error) {
        this.$emit('error', true, 'error', error.message);
      }
      this.dialog = false;
    },
  },
};
</script>
