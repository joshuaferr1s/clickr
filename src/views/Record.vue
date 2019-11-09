<template>
  <v-container class=" d-flex justify-center">
    <v-card style="maxWidth: 400px;">
      <v-card-title>{{ movie.movie }}</v-card-title>
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
        <v-list>
          <record-movie-list-item
            :id="movie.id"
            formattedType="£3"
            type="tp"
            :value="movie.tp"
            :total="movie.total"
            @error="setAlert"
          />
          <record-movie-list-item
            :id="movie.id"
            formattedType="£4"
            type="fp"
            :value="movie.fp"
            :total="movie.total"
            @error="setAlert"
          />
          <record-movie-list-item
            :id="movie.id"
            formattedType="Free"
            type="free"
            :value="movie.free"
            :total="movie.total"
            @error="setAlert"
          />
          <record-movie-list-item
            :id="movie.id"
            formattedType="£2"
            type="twp"
            :value="movie.twp"
            :total="movie.total"
            @error="setAlert"
          />
          <record-movie-list-item
            :id="movie.id"
            formattedType="Family Network"
            type="fn"
            :value="movie.fn"
            :total="movie.total"
            @error="setAlert"
          />
          <record-movie-list-item
            :id="movie.id"
            formattedType="UoY Staff Card"
            type="sc"
            :value="movie.sc"
            :total="movie.total"
            @error="setAlert"
          />
          <record-movie-list-item
            :id="movie.id"
            formattedType="Miscellaneous"
            type="misc"
            :value="movie.misc"
            :total="movie.total"
            @error="setAlert"
          />
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title style="text-align: center">
                <strong>Total: </strong>{{ movie.total }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-btn
            block
            outlined
            color="orange"
            @click="stopRecording()"
          >
            Back
          </v-btn>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { db } from '../firebase';
import RecordMovieListItem from '../components/RecordMovieListItem.vue';

export default {
  name: 'record',
  components: {
    RecordMovieListItem,
  },
  data: () => ({
    unsubscribe: null,
    movie: {},
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
    stopRecording() {
      this.$router.push('/movies');
    },
  },
  created() {
    this.unsubscribe = db.collection('movies').doc(this.$route.params.id)
      .onSnapshot((snapshot) => {
        if (snapshot && snapshot.exists) {
          this.movie = {
            ...snapshot.data(),
            id: snapshot.id,
          };
        } else {
          this.$router.push('/movies');
        }
      });
  },
  beforeDestroy() {
    this.unsubscribe();
  },
};
</script>
