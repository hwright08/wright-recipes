<template>
  <div>
    <v-row align="center">
      <h1>Recipes</h1>
      <v-spacer></v-spacer>
      <v-btn to="form">+ Add New Recipe</v-btn>
    </v-row>
    <v-row>
      <v-col cols="12" md="4" lg="2">
        <v-card>
          <v-list>
            <v-list-item-group v-model="groupIndex" active-class="black lighten-1" mandatory @change="getRecipes">
              <v-list-item
                v-for="(group, i) in ['all', ...groups]"
                :key="i"
              >
                <v-list-item-title class="text-capitalize">{{ group }}</v-list-item-title>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>

      <v-col>
        <v-row>
          <v-col
            v-for="r in (!groupIndex ? recipes : filteredRecipes)"
            :key="r.id"
            cols="12"
            lg="4"
          >
            <v-card
              :to="`/recipe-details/${r.id}`"
              max-height="150px"
              style="overflow: hidden;"
            >
              <v-card-title class="pb-0">
                <v-row class="pa-0 px-2">
                  <v-col class="py-0" style="word-break: break-word;">{{ r.title }}</v-col>
                  <v-icon color="amber">
                    {{ r.favorite ? 'mdi-star' : 'mdi-star-outline' }}
                  </v-icon>
                </v-row>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col>
                    <span class="font-weight-bold">Total Time:</span>
                    {{ (r.prep_time + r.cook_time) | time }}
                  </v-col>
                  <v-col class="text-right">
                    <span class="font-weight-bold">Servings:</span>
                    {{ r.serving_size}}
                  </v-col>
                </v-row>
                <p>
                  {{ r.description }}
                </p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import { mapGetters, mapState, mapActions } from 'vuex';
  import { time } from '@/utils/filters';

  export default {
    created() {
      this.getAllRecipes();
      this.getRecipeGroups();
    },

    data: () => ({
      groupIndex: 0,
      filteredRecipes: []
    }),

    filters: { time },

    computed: {
      ...mapState(['recipes', 'groups']),
      ...mapGetters(['recipesByGroup'])
    },

    methods: {
      ...mapActions(['getAllRecipes', 'getRecipeGroups']),

      getRecipes() {
        let group = this.groups[this.groupIndex - 1];
        this.filteredRecipes = this.recipesByGroup(group);
      }
    }
  };
</script>
