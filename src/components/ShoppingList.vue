<template>
  <section class="shopping-list">
    <h2>Liste de Courses</h2>
    <div class="total-quantity">Total: {{ totalQuantity }}</div>

    <ul>
      <li v-for="item in shoppingList" :key="item.id" class="shopping-item">
        <strong>{{ item.nom }}</strong>
        <br />
        Quantité Hebdo: {{ item.quantite_hebdo }}
        <br />
        Type: {{ item.type_aliment }}
        <br />
        Peut se consommer le soir: {{ item.conseille_pour_soir ? 'Oui' : 'Non' }}
        <br />
        Apports: {{ item.type_apport.join(', ') }}
        <br />
        Quantité Totale: {{ item.totalQuantite }}
        <br />
        <button @click="removeFromList(item)">Supprimer</button>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useEventBus } from '@vueuse/core'

const shoppingList = ref([])

const loadShoppingList = async () => {
  try {
    const response = await axios.get('http://localhost:3000/json/shopping_list.json')
    const data = response.data
    const quantityMap = data.reduce((map, item) => {
      if (!map[item.id]) {
        map[item.id] = { ...item, totalQuantite: parseFloat(item.quantite_hebdo) }
      } else {
        map[item.id].totalQuantite += parseFloat(item.quantite_hebdo)
      }
      return map
    }, {})

    shoppingList.value = Object.values(quantityMap).map((item) => ({
      ...item,
      quantite_hebdo: item.totalQuantite.toFixed(2) + ' kg'
    }))
  } catch (error) {
    console.error('Erreur lors du chargement de la liste de courses:', error)
  }
}

const removeFromList = async (item) => {
  try {
    await axios.post('http://localhost:3000/api/remove-from-shopping-list', {
      id: item.id
    })
    shoppingList.value = shoppingList.value.filter((product) => product.id !== item.id)
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error)
  }
}

const totalQuantity = computed(() => {
  return shoppingList.value
    .reduce((total, item) => total + parseFloat(item.totalQuantite), 0)
    .toFixed(2)
})

onMounted(() => {
  loadShoppingList()

  // Écouter l'événement pour recharger la liste
  const eventBus = useEventBus('shoppingListUpdated')
  eventBus.on(() => {
    loadShoppingList()
  })
})
</script>

<style scoped>
ul {
  padding: 0;
}
.shopping-list {
  padding: 10px;
  position: relative; /* Ajouté pour le positionnement de la quantité totale */
}

.shopping-item {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  list-style: none;
  display: flex;
  flex-direction: column;
}

.shopping-item button {
  margin-top: 5px;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  background-color: #f44336;
  color: #fff;
  cursor: pointer;
}

.shopping-item button:hover {
  background-color: #c62828;
}

/* Style pour le total de la quantité */
.total-quantity {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #fff;
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
