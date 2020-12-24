<template>
<div>
  <v-card>
    <v-card-title class="text-h4">
      <v-row align="center">
        <v-btn icon class="mr-3" @click="toggle">
          <v-icon large color="amber">
            {{ recipeDetails.favorite ? 'mdi-star' : 'mdi-star-outline' }}
          </v-icon>
        </v-btn>
        <v-col class="pa-0">
          <span style="word-break: break-word;">{{ recipeDetails.title }}</span>
        </v-col>
        <v-btn :to="`/form/${this.id}`">
          <v-icon left>mdi-pencil</v-icon>
          Edit
        </v-btn>
      </v-row>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-row align="center">
        <v-col class="pt-0">
          <v-chip class="text-capitalize ml-3">{{ recipeDetails.category }}</v-chip>
        </v-col>
        <v-col class="pt-0">
          <span class="font-weight-bold">Prep Time: </span> {{ recipeDetails.prep_time }}
        </v-col>
        <v-col class="pt-0">
          <span class="font-weight-bold">Cook Time: </span> {{ recipeDetails.cook_time }}
        </v-col>
        <v-col class="pt-0">
          <span class="font-weight-bold">Serving Size: </span> {{ recipeDetails.serving_size }}
        </v-col>
      </v-row>

      <p>{{ recipeDetails.description }}</p>
    </v-card-text>

  </v-card>

  <v-row>
    <v-col cols="12" sm="4" md="3">
      <v-card>
        <v-card-title class="pb-2">Ingredients</v-card-title>
        <v-divider></v-divider>
        <v-list>
          <v-list-item v-for="(ing, i) in recipeDetails.ingredients" :key="i">
            <v-list-item-title style="white-space: initial;">{{ ing.amount }} {{ ing.unit }} {{ ing.item }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>

    <v-col>
      <v-card>
        <v-card-title>Instructions</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <ol>
            <li v-for="(inst, i) in recipeDetails.directions" :key="i" class="pb-4">{{ inst }}</li>
          </ol>
        </v-card-text>
      </v-card>

      <v-card class="mt-4" v-if="recipeDetails.notes">
        <v-card-title>Notes</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <ol>
            <li v-for="(note, i) in recipeDetails.notes" :key="i" class="pb-4">{{ note }}</li>
          </ol>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { time } from '@/utils/filters';

export default {
  created() {
    this.id = this.$route.params.id;
    this.getRecipeDetails(this.id);
  },

  filters: { time },

  data: () => ({
    id: 0
  }),

  computed: {
    ...mapState(['recipeDetails'])
  },

  methods: {
    ...mapActions(['getRecipeDetails', 'toggleFavorite']),

    async toggle() {
      if (!this.id) return;

      let { favorite } = this.recipeDetails;
      await this.toggleFavorite({ id: this.id, favorite: !favorite });
      this.getRecipeDetails(this.id);
    }
  }
};
</script>
