<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on }">
      <v-btn outlined color="green" v-on="on">Add New Movie</v-btn>
    </template>
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>Add New Movie</v-card-title>
      <v-card-text class="mt-3">
        <v-alert
          v-model="alert.show"
          :type="alert.type"
          border="left"
          dismissible
          @input="setAlert(false, null, null)"
        >
          {{ alert.message }}
        </v-alert>
        <v-text-field v-model="movie" label="Movie Title"></v-text-field>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="resetDialog()">Cancel</v-btn>
        <v-btn color="green" text @click="addMovie()">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Firebase from '../firebase';

export default {
  name: 'add-movie',
  data: () => ({
    dialog: false,
    movie: '',
    alert: {
      show: false,
      type: null,
      message: null,
    },
  }),
  methods: {
    setAlert(show, type, message) {
      this.alert.show = show;
      this.alert.type = type;
      this.alert.message = message;
    },
    resetDialog() {
      this.movie = '';
      this.dialog = false;
    },
    async addMovie() {
      if (this.movie === '') return;
      try {
        const result = await Firebase.addMovie(this.movie);
        if (result.message) throw new Error(result.message);
        this.resetDialog();
      } catch (error) {
        this.setAlert(true, 'error', error.message);
      }
    },
  },
};
</script>
