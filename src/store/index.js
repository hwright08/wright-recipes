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
    }
  },

  actions: {
    async getAllRecipes({ commit }) {
      const { docs } = await db.collection('recipe').get();
      const recipes = docs.map(doc => ({ id: doc.id, ...doc.data() }) );
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
  },

  getters: {
    existingIngredients: state => {
      let ings = state.recipes.reduce((ing, recipe) => {
        recipe.ingredients.forEach(i => {
          if (!ing.includes(i.item)) ing.push(i.item);
        });
        return ing;
      }, []);
      return ings;
    },

    recipesByGroup: state => group => {
      return state.recipes.filter(val => val.category == group);
    }
  }
});
