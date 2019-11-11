<template>
  <v-container class="movies">
    <v-layout row wrap>
      <v-flex xs12 sm9>
        <v-text-field
          v-model="search"
          label="Search Movies"
          prepend-icon="mdi-magnify"
        ></v-text-field>
      </v-flex>
      <v-flex xs12 sm3 class="d-flex justify-center align-center">
        <add-movie />
      </v-flex>
    </v-layout>
    <v-data-table
      :headers="headers"
      :items="movies"
      :items-per-page="10"
      :search="search"
      sort-by="created_at"
      sort-desc
      :loading="loading"
    >
      <template v-slot:top>
        <v-alert
          v-model="alert.show"
          :type="alert.type"
          border="left"
          dismissible
          @input="setAlert(false, null, null)"
        >
          {{ alert.message }}
        </v-alert>
      </template>
      <template v-slot:item.movie="{ item }">
        <v-edit-dialog
          :return-value.sync="item.movie"
          @save="updateMovieTitle(item.id, item.movie)"
        >
          {{ item.movie }}
          <template v-slot:input>
            <v-text-field
              v-model="item.movie"
              label="Edit"
              single-line
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>
      <template v-slot:item.actions="{ item }">
        <td class="text-xs-left" style="width: 8rem">
          <v-icon
            small
            color="green"
            class="mr-2"
            @click="recordMovie(item.id)"
          >
            mdi-filmstrip
          </v-icon>
          <v-icon
            small
            color="error"
            @click="deleteMovie(item.id)"
          >
            mdi-delete
          </v-icon>
        </td>
      </template>
      <template v-slot:no-data>
        There are no movies in the database.
      </template>
      <template v-slot:no-results>
        There are no movies in the database matching search term: {{ search }}
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import Firebase, { db } from '../firebase';
import AddMovie from '../components/AddMovie.vue';

export default {
  name: 'movies',
  components: {
    AddMovie,
  },
  data: () => ({
    unsubscribe: null,
    search: '',
    loading: false,
    headers: [
      { text: 'Movie', value: 'movie' },
      { text: '£3', value: 'tp' },
      { text: '£4', value: 'fp' },
      { text: 'Free', value: 'free' },
      { text: '£2', value: 'twp' },
      { text: 'FN', value: 'fn' },
      { text: 'SC', value: 'sc' },
      { text: 'Misc', value: 'misc' },
      { text: 'Total', value: 'total' },
      { text: 'Date', value: 'created_at' },
      { text: 'Actions', value: 'actions' },
    ],
    movies: [],
    actions: [
      'Record',
      'Edit',
      'Delete',
    ],
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
    recordMovie(id) {
      this.$router.push({ name: 'record', params: { id } });
    },
    async updateMovieTitle(id, movie) {
      this.loading = true;
      try {
        const result = await Firebase.updateMovie({ id, movie });
        if (result.message) throw new Error(result.message);
      } catch (error) {
        this.setAlert(true, 'error', error.message);
      }
      this.loading = false;
    },
    async deleteMovie(id) {
      this.loading = true;
      try {
        await Firebase.deleteMovie(id);
      } catch (error) {
        this.setAlert(true, 'error', error.message);
      }
      this.loading = false;
    },
  },
  created() {
    this.unsubscribe = db.collection('movies').onSnapshot((snapshot) => {
      const changes = snapshot.docChanges();

      changes.forEach((change) => {
        if (change.type === 'added') {
          this.movies.push({
            ...change.doc.data(),
            id: change.doc.id,
          });
        } else if (change.type === 'removed') {
          const docIndex = this.movies.findIndex(el => el.id === change.doc.id);
          this.movies.splice(docIndex, 1);
        }
      });
    });
  },
  beforeDestroy() {
    this.unsubscribe();
  },
};
</script>
