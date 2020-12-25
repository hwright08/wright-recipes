<template>
<div>
  <v-calendar
    :events="meals"
    :weekdays="weekdays"
    @click:event="selectEvent"
    @click:date="selectDate"
  ></v-calendar>

  <v-menu
    v-model="showDetails"
    :close-on-content-click="false"
    :activator="selectedElement"
    max-width="350px"
    offset-x
  >
    <v-card>
      <v-toolbar color="primary" dense>
        <v-toolbar-title>{{ selectedEvent.name }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon :to="`/recipe-details/${selectedEvent.recipe_id}`">
          <v-icon>mdi-eye</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon @click="deleteEvent">mdi-delete</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        {{ selectedEvent.desc }}
      </v-card-text>
    </v-card>
  </v-menu>

  <v-dialog :value="showAddDialog" persistent width="50%">
    <v-card>
      <v-toolbar dense flat>
        <v-toolbar-title>Add Recipe to {{ eventData.date }}</v-toolbar-title>
      </v-toolbar>
      <v-card-text class="mt-4">
        <v-form ref="form">
          <v-autocomplete
            v-model="eventData.recipe_id"
            :items="recipes"
            item-text="title"
            item-value="id"
            :rules="[val => !!val || 'This field is required']"
            outlined
            dense
          ></v-autocomplete>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="showAddDialog = false">Cancel</v-btn>
        <v-btn @click="saveMeal">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
export default {
  async created() {
    await this.getMeals();
  },

  computed: {
    ...mapState(['meals', 'recipes'])
  },

  data: () => ({
    weekdays: [1,2,3,4,5,6,0],
    showDetails: false,
    showAddDialog: false,
    selectedEvent: {},
    selectedElement: undefined,
    recipesLoaded: false,
    eventData: {
      date: '',
      recipe_id: undefined
    },
  }),

  methods: {
    ...mapActions(['getMeals', 'getAllRecipes', 'addMeal', 'deleteMeal']),

    selectEvent({ nativeEvent, event }) {
      this.selectedEvent = event;
      this.selectedElement = nativeEvent.target;
      this.showDetails = true;

      nativeEvent.stopPropagation();
    },

    async selectDate(e) {
      if (!this.recipesLoaded) {
        await this.getAllRecipes();
        this.recipesLoaded = true;
      }
      this.eventData.date = e.date;
      this.showAddDialog = true;
    },

    async saveMeal() {
      if (!this.$refs.form || !this.$refs.form.validate() || !this.eventData.date) {
        return;
      }

      await this.addMeal(this.eventData);
      this.getMeals();
      this.showAddDialog = false;
    },

    async deleteEvent() {
      await this.deleteMeal(this.selectedEvent.id);
      await this.getMeals();
      this.showDetails = false;
    }
  }
};
</script>
