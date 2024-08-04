<template>
  <section class="shopping-list">
    <h2>Liste de Courses</h2>
    <ul>
      <li v-for="item in shoppingList" :key="item.nom_id" class="product-item">
        <div class="quantity-container">
          <span class="quantity total-quantity">Qt: {{ item.totalQuantity }}</span>
        </div>
        <div class="product-content">
          <h3>{{ item.nom }}</h3>
          <p>
            Quantité Hebdo: <span class="bold">{{ item.quantite_hebdo }}</span>
          </p>
          <p>
            Type: <span class="bold">{{ item.type_aliment }}</span>
          </p>
          <p>
            Peut se consommer le soir:
            <span class="bold">{{ item.conseille_pour_soir ? 'Oui' : 'Non' }} </span>
          </p>
          <p>
            Apports: <span class="bold">{{ item.type_apport.join(', ') }}</span>
          </p>
          <button @click="removeFromList(item)">Supprimer</button>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'
import { useEventBus } from '@vueuse/core'

const toast = useToast()
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

    // Afficher une notification de succès
    toast.info(`${item.nom} a été supprimé de la liste de courses.`)
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error)

    // Afficher une notification d'erreur
    toast.error('Erreur lors de la suppression du produit.')
  }
}

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
.bold {
  font-weight: bold;
}
/* Styles généraux pour la liste de courses */
.shopping-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Styles pour chaque élément de produit */
.product-item {
  position: relative;
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 10px;
  padding: 0 20px 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition:
    box-shadow 0.3s ease,
    transform 0.3s ease;
}

.product-item:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  transform: translateY(-4px);
}

/* Conteneur pour la quantité totale */
.quantity-container {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #f0f1f3;
  padding: 10px 15px;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-weight: 600;
  color: #495057;
  font-size: 1.2em;
}

/* Contenu du produit */
.product-content {
  margin-top: 20px;
}

.product-content h3 {
  font-size: 1.4em;
  margin: 0 0 15px;
  color: #343a40;
}

.product-content p {
  margin: 8px 0;
  color: #6c757d;
}

/* Bouton pour supprimer le produit */
button {
  background-color: #dc3545;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 12px 18px;
  font-size: 14px;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;
  display: inline-block;
  text-align: center;
}

button:hover {
  background-color: #c82333;
  transform: translateY(-2px);
}

/* Liste des éléments */
ul {
  padding: 0;
  list-style: none;
  margin: 0;
}
</style>
