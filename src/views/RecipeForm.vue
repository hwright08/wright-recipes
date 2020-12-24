<template>
<div>
  <v-card>
    <v-card-title>{{ this.id ? 'Edit' : 'Add' }} Recipe</v-card-title>
    <v-card-text>
      <v-form ref="form">
        <v-row align="center">
          <v-col cols="12" sm="6" md="4">
            <v-label for="title">Recipe Name</v-label>
            <v-text-field
              id="title"
              v-model="formData.title"
              :rules="[required]"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-label for="category">Recipe Category</v-label>
            <v-combobox
              id="category"
              v-model="formData.category"
              :items="groups"
              :rules="[required]"
              outlined
              dense
            ></v-combobox>
          </v-col>
          <v-col class="py-0" cols="12" sm="6" md="4">
            <v-label for="servings"># of Servings</v-label>
            <v-text-field
              id="servings"
              v-model="formData.serving_size"
              type="number"
              :rules="[required]"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col class="py-0" cols="12" sm="6" md="4">
            <v-label for="prep_time">Prep Time</v-label>
            <v-text-field
              id="prep_time"
              v-model="formData.prep_time"
              type="number"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col class="py-0" cols="12" sm="6" md="4">
            <v-label for="cook_time">Cook Time</v-label>
            <v-text-field
              id="cook_time"
              v-model="formData.cook_time"
              type="number"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-checkbox
              v-model="formData.favorite"
              label="Favorite"
              on-icon="mdi-star"
              off-icon="mdi-star-outline"
              color="amber"
            ></v-checkbox>
          </v-col>
        </v-row>

        <v-label for="desc">Recipe Description</v-label>
        <v-textarea
          id="desc"
          v-model="formData.description"
          :rules="[required]"
          :rows="2"
          outlined
          dense
        ></v-textarea>

        <v-row>
          <v-col cols="12" sm="4" lg="3">
            <h2>Ingredients</h2>
            <v-list>
              <v-list-item v-for="(ing, i) in formData.ingredients" :key="ing.item">
                <v-list-item-title>
                  <v-btn icon @click.stop="open('ing', { index: i, ...ing })">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  {{ ing.amount}} {{ ing.unit }} {{ ing.item }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
            <v-btn @click.stop="open('ing')">Add Ingredient</v-btn>
          </v-col>
          <v-divider vertical></v-divider>
          <v-col>
            <h2 class="mb-4">Instructions</h2>
            <v-list>
              <v-list-item v-for="(ins, i) in formData.directions" :key="i">
                <v-list-item-title>
                  <v-btn icon @click.stop="open('ins', { index: i, text: ins })">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  {{ ins }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
            <v-btn class="mt-4" @click.stop="open('ins')">Add Instruction</v-btn>

            <h2 class="mt-8 mb-4">Notes</h2>
            <v-list>
              <v-list-item v-for="(note, i) in formData.notes" :key="i">
                <v-list-item-title>
                  <v-btn icon @click.stop="open('note', { index: i, text: note })">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  {{ note }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
            <v-btn class="mt-4" @click.stop="open('note')">Add Note</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="saveRecipe">Save Recipe</v-btn>
    </v-card-actions>
  </v-card>

  <v-dialog :value="showDialog" persistent width="50%">
    <v-card>
      <v-card-title>
        <span v-if="type == 'ing'">Ingredient</span>
        <span v-if="type == 'ins'">Instruction</span>
        <span v-if="type == 'note'">Note</span>
        </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form ref="addForm">
          <div v-if="type == 'ing'">
            <v-row>
              <v-col cols="12" md="4">
                <v-label for="amount">Amount</v-label>
                <v-text-field
                  id="amount"
                  v-model="ingredient.amount"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-label for="unit">Unit</v-label>
                <v-combobox
                  id="unit"
                  v-model="ingredient.unit"
                  :items="units"
                  outlined
                  dense
                ></v-combobox>
              </v-col>
              <v-col cols="12" md="4">
                <v-label for="item">Ingredient</v-label>
                <v-combobox
                  id="item"
                  v-model="ingredient.item"
                  :items="allIngredients"
                  :rules="[required]"
                  outlined
                  dense
                ></v-combobox>
              </v-col>
            </v-row>
          </div>
          <div v-else-if="this.type == 'ins'">
            <v-label for="ins">Instruction</v-label>
            <v-textarea
              id="ins"
              v-model="direction.text"
              :rules="[required]"
              :rows="2"
              outlined
              dense
            ></v-textarea>
          </div>
          <div v-else-if="this.type == 'note'">
            <v-label for="note">Note</v-label>
            <v-textarea
              id="note"
              v-model="note.text"
              :rules="[required]"
              :rows="2"
              outlined
              dense
            ></v-textarea>
          </div>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click.stop="showDialog = false">cancel</v-btn>
        <v-btn @click.stop="addItem">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  async created() {
    this.id = this.$route.params.id;
    this.formData = {...this.formData, ...(await this.getRecipeDetails(this.id))};
    this.getExistingIngredients();
  },

  data: () => ({
    id: 0,
    showDialog: false,
    type: '',
    direction: { text: '', index: null },
    note: { text: '', index: null },
    ingredient: {
      index: null,
      item: '',
      amount: '',
      unit: '',
    },
    formData: {
      title: '',
      category: '',
      prep_time: 0,
      cook_time: 0,
      serving_size: 0,
      description: '',
      ingredients: [],
      directions: [],
      notes: [],
      favorite: false,
    }
  }),

  computed: {
    ...mapState({allIngredients: 'ingredients'}),
    ...mapState(['groups', 'units']),
  },

  methods: {
    ...mapActions(['addRecipe', 'getRecipeDetails', 'getExistingIngredients']),

    required(val) {
      let isEmpty = val == '' || !val;
      return !isEmpty || 'This field is required';
    },

    open(type, item = null) {
      this.type = type;
      this.ingredient = {};
      this.direction = { text: '', index: null };
      this.note = { text: '', index: null };
      if (item) {
        if (type == 'ing') this.ingredient = { ...item };
        if (type == 'ins') this.direction = { ...item };
        if (type == 'note') this.note = { ...item };
      }
      if (this.$refs.addForm) this.$refs.addForm.resetValidation();
      this.showDialog = true;
    },

    addItem() {
      if (!this.$refs.addForm.validate()) return;

      if (this.type == 'ing') {
        if (this.ingredient.index != null) {
          let index = this.ingredient.index;
          delete this.ingredient.index;
          this.$set(
            this.formData.ingredients,
            index,
            { ...this.ingredient }
          );
        } else {
          this.$set(
            this.formData,
            'ingredients',
            [...this.formData.ingredients, { ...this.ingredient }]
          );
        }
      }

      if (this.type == 'ins') {
        if (this.direction.index != null) {
          this.$set(
            this.formData.directions,
            this.direction.index,
            this.direction.text
          );
        } else {
          this.$set(
            this.formData,
            'directions',
            [...this.formData.directions, this.direction.text]
          );
        }
      }

      if (this.type == 'note') {
        if (this.note.index != null) {
          this.$set(
            this.formData.notes,
            this.note.index,
            this.note.text
          );
        } else {
          this.$set(
            this.formData,
            'notes',
            [...this.formData.notes, this.note.text]
          );
        }
      }

      this.showDialog = false;
    },

    async saveRecipe() {
      // clean up the data
      let data = {};
      for (let key in this.formData) {
        // trim strings
        if (typeof this.formData[key] == 'string') data[key] = this.formData[key].trim();
        else if (typeof this.formData[key] == 'object') {
          data[key] = [];
          for (let i of this.formData[key]) {
            if (key != 'ingredients') data[key].push(i.trim());
            else {
              data[key].push({ ...i , item: i.item.trim() });
            }
          }
        }
        else data[key] = this.formData[key];

        if (key == 'category') data[key] = data[key].toLowerCase();
      }

      // validate
      if (!this.$refs.form.validate()) {
        console.error('Fill in all required fields');
        return;
      }

      if (this.id) data.id = this.id;
      await this.addRecipe(data);
      this.$router.push({ path: '/'});
    }
  }
};
</script>
