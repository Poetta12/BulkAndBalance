// main.js ou main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css' // Importation des styles de toastification
import './assets/styles.css' // Importer le fichier de styles personnalisé
import './assets/main.css'
import './assets/base.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Configuration de vue-toastification avec des classes personnalisées
app.use(Toast, {
  position: POSITION.TOP_CENTER,
  timeout: 3000,
  hideProgressBar: false,
  toastClassName: 'toast-custom', // Appliquer une classe personnalisée globale
  progressClassName: 'toast-progress', // Appliquer une classe personnalisée pour la barre de progression
  successClassName: 'toast-success', // Appliquer une classe personnalisée pour les succès
  errorClassName: 'toast-error', // Appliquer une classe personnalisée pour les erreurs
  infoClassName: 'toast-info' // Appliquer une classe personnalisée pour les informations
})

app.mount('#app')
