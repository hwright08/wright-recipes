import Vue from 'vue';
import Vuex from 'vuex';
import firebase from  'firebase/app';

const db = firebase.firestore();

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    recipes: [],
    recipeDetails: {},
    groups: [],
    units: [],
    ingredients: [],
    meals: []
  },

  mutations: {
    getAllRecipes(state, recipes) {
      state.recipes = recipes;
    },

    getRecipeDetails(state, details) {
      state.recipeDetails = details;
    },

    getRecipeGroups(state, groups) {
      state.groups = groups;
    },

    getExistingIngredients(state, ingredients) {
      state.ingredients = ingredients;
    },

    getUnits(state, units) {
      state.units = units;
    },

    getMeals(state, meals) {
      state.meals = meals;
    }
  },

  actions: {
    async getAllRecipes({ commit }) {
      const { docs } = await db.collection('recipe').get();
      const recipes = docs.map(doc => {
        let data = doc.data();
        return {
          id: doc.id,
          ...data,
          cook_time: parseInt(data.cook_time),
          prep_time: parseInt(data.prep_time)
        }
      }).sort((a,b) => a.title <= b.title ? -1 : 1);
      commit('getAllRecipes', recipes);
    },

    async getRecipeDetails({ commit }, id) {
      const r = await db.collection('recipe').doc(id).get();
      commit('getRecipeDetails', r.data());
      return r.data();
    },

    async toggleFavorite(context, { id, favorite }) {
      return await db.collection('recipe')
        .doc(id)
        .update({ favorite: favorite });
    },

    async addRecipe(context, data) {
      if (!data.id) {
        // add new recipe
        let recipeRef = await db.collection('recipe').doc();
        recipeRef.set(data);

      } else {
        // update existing recipe
        let id = data.id;
        delete data.id;
        await db.collection('recipe')
          .doc(id)
          .update(data);
      }
    },

    async getRecipeGroups({ commit }) {
      const { docs } = await db.collection('recipe').get();
      const groups = docs.reduce((arr, doc) => {
        let category = doc.data().category;
        if (!arr.includes(category)) return [...arr, category];
        return arr;
      }, []);
      commit('getRecipeGroups', groups.sort());
    },

    async getExistingIngredients({ commit }) {
      const { docs } = await db.collection('recipe').get();
      let units = [];
      const ingredients = docs.reduce((arr, doc) => {
        doc.data().ingredients.forEach(ing => {
          if (!arr.includes(ing.item)) arr.push(ing.item);
          if (ing.unit && !units.includes(ing.unit)) units.push(ing.unit);
        });
        return arr;
      }, []);
      commit('getExistingIngredients', ingredients);
      commit('getUnits', units);
    },

    async getMeals({ commit }) {
      const { docs } = await db.collection('meal').get();
      let meals = docs.map(async doc => {
        let r = await doc.data().recipe_ref.get();
        return {
          id: doc.id,
          recipe_id: r.id,
          name: r.data().title,
          desc: r.data().description,
          start: doc.data().date
        }
      });
      await Promise.all(meals).then(vals => commit('getMeals', vals));
    },

    async deleteMeal(context, meal_id) {
      let ref = await db.collection('meal').doc(meal_id);
      ref.delete();
    },

    async addMeal(context, data) {
      if (!data.date || !data.recipe_id) return;
      let recipeRef = await db.collection('recipe').doc(data.recipe_id);
      let ref = await db.collection('meal').doc();
      ref.set({
        date: data.date,
        recipe_ref: recipeRef
      });
    },

    async getGroceries(context, { startDate, endDate }) {
      const ref = db.collection('meal');
      const ref1 = ref.where('date', '>=', startDate);
      const ref2 = ref1.where('date', '<=', endDate);
      let d = await ref2.get();
      let data = d.docs.map(async val => {
        let mealData = val.data();
        let r = await val.data().recipe_ref.get();
        let { title, ingredients, serving_size } = r.data();
        return {
          date: mealData.date,
          title,
          ingredients,
          serving_size
        }
      });

      return await Promise.all(data);
    }
  },

  getters: {
    recipesByGroup: state => group => {
      return state.recipes.filter(val => val.category == group);
    }
  }
});
