<style>
.v-card__text {
  font-size: 16px !important;
}
</style>


<template>
  <div id="app">
    <v-app dark>
      <v-main>
        <v-app-bar class="d-print-none">
          <v-icon class="mr-2">mdi-book-open-variant</v-icon>
          <v-btn tile text to="/" style="height: 100%;">Recipes</v-btn>
          <v-btn tile text to="/calendar" style="height: 100%;">Calendar</v-btn>
          <v-btn tile text to="/groceries" style="height: 100%;">Groceries</v-btn>
        </v-app-bar>

        <v-container>
          <router-view/>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
