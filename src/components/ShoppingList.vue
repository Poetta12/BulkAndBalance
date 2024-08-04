<template>
  <section class="shopping-list">
    <h2>Liste de Courses</h2>
    <ul>
      <li v-for="item in shoppingList" :key="item.nom_id" class="product-item">
        <div class="quantity-container">
          <span class="quantity total-quantity">Total: {{ item.totalQuantity }}</span>
        </div>
        <div class="product-content">
          <h3>
            {{ item.nom }}
          </h3>
          <p>Quantité Hebdo: {{ item.quantite_hebdo }}</p>
          <p>Type: {{ item.type_aliment }}</p>
          <p>Peut se consommer le soir: {{ item.conseille_pour_soir ? 'Oui' : 'Non' }}</p>
          <p>Apports: {{ item.type_apport.join(', ') }}</p>
          <button @click="removeFromList(item)">Supprimer</button>
        </div>
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

    // Compter le nombre d'occurrences de chaque nom_id
    const countMap = data.reduce((map, item) => {
      if (!map[item.nom_id]) {
        // Initialiser un nouvel objet pour le produit
        map[item.nom_id] = {
          ...item,
          occurrenceCount: 1 // Nombre d'occurrences initialisé à 1
        }
      } else {
        // Incrémenter le nombre d'occurrences existant
        map[item.nom_id].occurrenceCount += 1
      }
      return map
    }, {})

    shoppingList.value = Object.values(countMap).map((item) => ({
      ...item,
      quantite_hebdo: item.quantite_hebdo, // Conserver la valeur d'origine
      totalQuantity: item.occurrenceCount // Nombre d'occurrences
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
    loadShoppingList() // Recharger la liste après suppression
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error)
  }
}

const totalQuantity = computed(() => {
  return shoppingList.value.reduce((total, item) => total + item.totalQuantity, 0)
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
.product-item {
  position: relative; /* Nécessaire pour le positionnement absolu des éléments enfants */
  border: 1px solid #ddd;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
}

.quantity-container {
  width: 100px;
  position: absolute;
  top: 0;
  right: 0;
  background-color: #f8f9fa;
  padding: 5px;
  border-radius: 5px;
  font-weight: bold;
  color: #333;
}

.product-content {
  margin-top: 30px; /* Assurez-vous que le contenu n'est pas couvert par la quantité */
}

.total-quantity {
  font-size: 1.2em;
  margin-bottom: 20px;
  font-weight: bold;
}

ul {
  padding: 0;
  list-style: none;
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
