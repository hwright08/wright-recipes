import Vue from 'vue'
import VueRouter from 'vue-router'
import Recipes from '../views/Recipes.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Recipes',
    component: Recipes
  }, {
    path: '/recipe-details/:id',
    name: 'Recipe Details',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "recipeDetails" */ '../views/RecipeDetails.vue')
  },  {
    path: '/form',
    name: 'Recipe Form',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "recipeForm" */ '../views/RecipeForm.vue')
  }, {
    path: '/form/:id',
    name: 'Recipe Form Edit',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "recipeFormEdit" */ '../views/RecipeForm.vue')
  }, {
    path: '/calendar',
    name: 'Calendar',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "calendar" */ '../views/Calendar.vue')
  }, {
    path: '/groceries',
    name: 'Groceries',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "groceries" */ '../views/Groceries.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
