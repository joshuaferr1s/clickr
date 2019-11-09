<template>
  <v-list-item>
    <v-list-item-content>
      <v-list-item-title><strong>{{ formattedType }}:</strong> {{ value }}</v-list-item-title>
    </v-list-item-content>
    <v-list-item-action>
      <div>
        <v-icon
          large
          color="green accent-3"
          @click="add()"
          style="user-select: none;"
        >mdi-plus-circle</v-icon>
        <v-icon
          large
          color="error"
          @click="sub()"
          style="user-select: none;"
        >mdi-minus-circle</v-icon>
      </div>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import Firebase from '../firebase';

export default {
  name: 'record-movie-list-item',
  props: ['id', 'formattedType', 'type', 'value', 'total'],
  methods: {
    add() {
      try {
        const result = Firebase.recordMovie({
          id: this.id,
          type: this.type,
          value: this.value + 1,
          total: this.total + 1,
        });
        if (result.message) throw new Error(result.message);
      } catch (error) {
        this.$emit('error', true, 'error', error.message);
      }
    },
    sub() {
      try {
        const result = Firebase.recordMovie({
          id: this.id,
          type: this.type,
          value: this.value - 1,
          total: this.total - 1,
        });
        if (result.message) throw new Error(result.message);
      } catch (error) {
        this.$emit('error', true, 'error', error.message);
      }
    },
  },
};
</script>
