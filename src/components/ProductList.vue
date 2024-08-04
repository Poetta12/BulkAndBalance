<template>
  <section class="product-list">
    <h2>Liste des Produits</h2>

    <div class="filters">
      <label for="type-filter">
        <span>Par type :</span>
        <select v-model="selectedType" id="type-filter">
          <option value="">Tous les types</option>
          <option v-for="type in uniqueTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
      </label>

      <label for="apport-filter">
        <span>Par apports :</span>
        <select v-model="selectedApport" id="apport-filter">
          <option value="">Tous les apports</option>
          <option v-for="apport in uniqueApports" :key="apport" :value="apport">
            {{ apport }}
          </option>
        </select>
      </label>
    </div>

    <input
      v-model="searchQuery"
      type="text"
      placeholder="Rechercher un produit..."
      class="search-bar"
    />

    <ul>
      <li v-for="product in paginatedProducts" :key="product.nom" class="product-item">
        <div class="product-content">
          <h3>{{ product.nom }}</h3>
          <p class="info">
            Quantité Hebdo: <span>{{ product.quantite_hebdo }}</span>
          </p>
          <p class="info">
            Type: <span>{{ product.type_aliment }}</span>
          </p>
          <p class="info">
            Consommable le soir: <span>{{ product.conseille_pour_soir ? 'Oui' : 'Non' }}</span>
          </p>
          <p class="info">
            Apports: <span>{{ product.type_apport.join(', ') }}</span>
          </p>
        </div>
        <button id="add-btn" @click="addToShoppingList(product)">
          Ajouter à la liste de courses
        </button>
      </li>
    </ul>

    <div class="pagination">
      <button @click="currentPage--" :disabled="currentPage <= 1">Précédent</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="currentPage++" :disabled="currentPage >= totalPages">Suivant</button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useEventBus } from '@vueuse/core' // Assurez-vous d'avoir @vueuse/core installé
import { v4 as uuidv4 } from 'uuid'

const products = ref([])
const searchQuery = ref('')
const selectedType = ref('')
const selectedApport = ref('')
const currentPage = ref(1)
const itemsPerPage = 4

const uniqueTypes = computed(() => {
  const types = new Set(products.value.map((product) => product.type_aliment))
  return Array.from(types)
})

const uniqueApports = computed(() => {
  const apports = new Set(products.value.flatMap((product) => product.type_apport))
  return Array.from(apports)
})

const filteredProducts = computed(() => {
  return products.value.filter((product) => {
    const matchesType = selectedType.value === '' || product.type_aliment === selectedType.value
    const matchesApport =
      selectedApport.value === '' || product.type_apport.includes(selectedApport.value)
    const matchesQuery = product.nom.toLowerCase().includes(searchQuery.value.toLowerCase())

    return matchesType && matchesApport && matchesQuery
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage)
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProducts.value.slice(start, end)
})

const addToShoppingList = async (product) => {
  try {
    const uuid = uuidv4() // Générer un UUID unique pour chaque produit ajouté

    await axios.post('http://localhost:3000/api/add-to-shopping-list', {
      item: { ...product, uuid } // Ajouter le UUID au produit, ne pas modifier la quantité
    })

    // Émettre un événement
    useEventBus('shoppingListUpdated').emit()
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit:", error)
  }
}

onMounted(() => {
  axios.get('/BDD/product_list.json').then((response) => {
    products.value = response.data
  })
})
</script>

<style scoped>
/* Styles pour une apparence propre et moderne */
.product-list {
  font-family: 'Arial', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.filters {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.filters label {
  display: flex;
  flex-direction: column;
  font-size: 14px;
}

.filters select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 5px;
}

.search-bar {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 20px;
}

ul {
  list-style: none;
  padding: 0;
}

.product-item {
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition: box-shadow 0.3s ease;
}

.product-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.product-content {
  margin-bottom: 15px;
}

.product-content h3 {
  margin-top: 0;
  color: #007bff;
}

.product-content .info {
  margin: 5px 0;
}

.product-content .info span {
  font-weight: bold;
}

button {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  margin: 0 10px;
}
</style>
