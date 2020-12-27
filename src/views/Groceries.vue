<style scoped>
@media print {
  #groceries {
    color: black !important;
  }
}
</style>

<template>
<div id="groceries">
  <v-row>
    <v-col>
      <v-label for="startDate">Start Date</v-label>
      <v-text-field
        id="startDate"
        v-model="startDate"
        type="date"
        :rules="[required, validDate]"
        hide-details="auto"
        outlined
        dense
      ></v-text-field>
    </v-col>
    <v-col>
      <v-label for="endDate">End Date</v-label>
      <v-text-field
        id="endDate"
        v-model="endDate"
        type="date"
        :rules="[required, validDate]"
        hide-details="auto"
        outlined
        dense
      ></v-text-field>
    </v-col>
  </v-row>
  <v-btn class="d-print-none" @click="getGroceriesByDate">Get List</v-btn>
  <v-btn class="d-print-none" v-if="printable" @click="print">Print</v-btn>

  <v-row class="caption">
    <v-col>
      <h2>Groceries</h2>
      <ul>
        <li v-for="(details, item) in list" :key="item">
          {{ item }}
          ({{ details.amount }} {{ details.unit }})
        </li>
      </ul>
    </v-col>
    <v-divider vertical></v-divider>
    <v-col>
      <h2>Recipes</h2>
      <div v-for="(date, i) in recipes" :key="i">
        <h3>{{ i }}</h3>
        <div v-for="(recipe, a) in date" :key="`${recipe.title}-${a}`" class="mb-3">
          {{ recipe.title }}
          <ul v-for="ing in recipe.ingredients" :key="ing.item">
            <li>{{ ing.amount }} {{ ing.unit }} {{ ing.item }}</li>
          </ul>
        </div>
        <v-divider></v-divider>
      </div>
    </v-col>
  </v-row>
</div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  created() {
    let today = this.getToday();
    this.startDate = today;
    this.endDate = today;
  },

  data: () => ({
    startDate: '',
    endDate: '',
    recipes: {},
    list: {},
    printable: false,
  }),

  methods: {
    ...mapActions(['getGroceries']),

    required(val) {
      return !!val || 'This field is required';
    },

    validDate() {
      if (!this.startDate || !this.endDate) return true;
      let start = new Date(this.startDate);
      let end = new Date(this.endDate);
      return start <= end || 'End Date must be on or after the Start Date';
    },

    getToday() {
      let today = new Date();
      let y = today.getFullYear();
      let m = today.getMonth() + 1;
      let d = today.getDate();
      return `${y}-${m}-${d}`
    },

    async getGroceriesByDate() {
      let { startDate, endDate } = this;
      const d = await this.getGroceries({startDate, endDate});
      if (d.length) this.printable = true;
      this.recipes = d.reduce((obj, i) => {
        if (!obj[i.date]) obj[i.date] = [i];
        else obj[i.date].push(i);

        return obj;
      }, {});
      this.getGroceryList(d);
    },

    getGroceryList(r) {
      let ingsList = r.reduce((arr, i) => {
        return [...arr, ...i.ingredients];
      }, []);
      ingsList.sort((a,b) => a.item >= b.item ? 1 : -1);
      this.list = ingsList.reduce((obj, i) => {
        let { item, amount, unit } = i;
        amount = this.convertToFloat(amount);
        if (!obj[item]) obj[item] = { amount, unit };
        else {
          // if same units, and valid float, add together
          // if not same units or string amount, add as separate property
          let sameUnits = unit == obj[item].unit;
          let stringType = typeof amount == 'string' || typeof obj[item].amount == 'string';
          if (sameUnits && !stringType) obj[item].amount += amount;
          else obj[item] = { amount, unit };
        }
        return obj;
      }, {});
    },

    print() {
      window.print();
    },

    convertToFloat(val) {
      if (typeof val == 'number') return val;
      if (typeof val == 'string') {
        let nums = val.split(' ').reduce((sum, i) => {
          // if the number is a fraction
          if (i.includes('/')) {
            let fraction = i.split('/');
            if (fraction[1] == 0) return sum;
            return sum + (fraction[0] / fraction[1]);
          } else {
            return sum + parseFloat(i);
          }
        }, 0);
        return isNaN(nums) ? val : nums;
      }
    }
  }
};
</script>
