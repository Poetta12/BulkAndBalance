<script setup>
import { ref } from 'vue'
import ProductList from '../components/ProductList.vue'
import MealPlanner from '../components/MealPlanner.vue'
import ShoppingList from '../components/ShoppingList.vue'
import NutritionalInfo from '../components/NutritionalInfo.vue'

const activeSection = ref('')

const toggleSection = (section) => {
  activeSection.value = activeSection.value === section ? '' : section
}

const navigateTo = (section) => {
  // Logic to navigate to different sections or views
  console.log(`Navigating to ${section}`)
}
</script>

<template>
  <div class="home">
    <header>
      <h1>
        Bienvenue <br />
        sur <br />
        <span>Bulk & Balance</span>
      </h1>
      <p>Organisez vos repas et gérez vos courses.</p>
    </header>

    <main>
      <div class="card" :class="{ open: activeSection === 'products' }">
        <div class="card-header" @click="toggleSection('products')">Produits</div>
        <div class="card-content">
          <ProductList />
        </div>
      </div>
      <div class="card" :class="{ open: activeSection === 'meals' }">
        <div class="card-header" @click="toggleSection('meals')">Repas</div>
        <div class="card-content">
          <MealPlanner />
        </div>
      </div>
      <div class="card" :class="{ open: activeSection === 'shopping' }">
        <div class="card-header" @click="toggleSection('shopping')">Courses</div>
        <div class="card-content">
          <ShoppingList />
        </div>
      </div>
      <div class="card" :class="{ open: activeSection === 'nutrition' }">
        <div class="card-header" @click="toggleSection('nutrition')">Nutrition</div>
        <div class="card-content">
          <NutritionalInfo />
        </div>
      </div>
    </main>

    <footer>
      <button @click="navigateTo('products')">Produits</button>
      <button @click="navigateTo('meals')">Repas</button>
      <button @click="navigateTo('shopping')">Courses</button>
      <button @click="navigateTo('nutrition')">Nutrition</button>
    </footer>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
  height: 80vh;
  font-family: Arial, sans-serif;
}

header {
  text-align: center;
  margin-bottom: 15px;
}

main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.card {
  color: #222;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition:
    max-height 0.3s ease,
    padding 0.3s ease;
}

.card-header {
  padding: 15px;
  font-weight: bold;
  background-color: #f1f1f1;
  cursor: pointer;
  text-align: center;
}

.card-content {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition:
    max-height 0.3s ease,
    opacity 0.3s ease;
}

.card.open .card-content {
  max-height: 1500px; /* Adjust as needed to fit the content */
  opacity: 1;
  padding: 15px 0;
}

footer {
  display: flex;
  justify-content: space-around;
  padding: 10px;
  box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
}

button {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
