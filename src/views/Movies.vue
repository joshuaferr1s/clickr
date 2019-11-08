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
      sort-by="movie"
      :loading="loading"
    >
      <template v-slot:item.actions="{ item }">
        <td class="text-xs-left" style="width: 8rem">
          <v-select
            @change="(action) => selectChanged(action, item)"
            :items="actions"
            label="Actions"
          ></v-select>
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
  }),
  methods: {
    async selectChanged(action, item) {
      this.loading = true;
      try {
        if (action === 'Delete') {
          await Firebase.deleteMovie(item.id);
        }
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
  },
  created() {
    db.collection('movies').onSnapshot((snapshot) => {
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
};
</script>
