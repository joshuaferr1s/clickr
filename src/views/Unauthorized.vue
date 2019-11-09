<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-title
            class="headline grey lighten-2"
            primary-title
          >
            404 Unauthorized
          </v-card-title>

          <v-card-text>
            You are not authorized to visit that page. Contact an admin for help.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'unathorized',
};
</script>
