<template>
  <div>
    <h1>Gestion de JSON</h1>
    <textarea
      v-model="jsonData"
      rows="10"
      cols="50"
      placeholder="Le contenu du JSON apparaîtra ici..."
    ></textarea>
    <br />
    <button @click="readJson">Lire JSON</button>
    <button @click="writeJson">Écrire JSON</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

// Déclaration des variables réactives
const jsonData = ref('')

// Fonction pour lire le JSON
const readJson = async () => {
  try {
    const response = await axios.get('/server/data.json')
    jsonData.value = JSON.stringify(response.data, null, 2)
  } catch (error) {
    console.error('Erreur lors de la lecture du JSON:', error)
  }
}

// Fonction pour écrire le JSON
const writeJson = async () => {
  try {
    const data = JSON.parse(jsonData.value)
    console.log(data)
    await axios.post('/api/write-json', data)
    alert('JSON écrit avec succès!')
  } catch (error) {
    console.error("Erreur lors de l'écriture du JSON:", error)
  }
}
</script>
